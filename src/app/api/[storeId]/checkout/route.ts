import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    const { productsChekout, productIds, qtysProductChek } = await req.json()

    console.log('Buscando size: ', productsChekout)

    if(!productsChekout || productsChekout.length === 0) {
        return new NextResponse("Los productos son requeridos")
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    // newQty.reverse()

    productsChekout.forEach((product: any, index: number) => {

        const priceAsNumber = parseFloat(product.price)
        const unitAmountInCents = Math.round(priceAsNumber * 100)
        const description = productsChekout[index].size ? `Talla ${productsChekout[index].size}` : ' '

        line_items.push({
            quantity: productsChekout[index].qty,
            price_data: {
                currency: 'EUR',
                product_data: {
                    name: product.name,
                    description: description || ''
                },
                unit_amount: unitAmountInCents,
            },
        })
    })

    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            status: 'Sin pagar',
            orderItems: {
                create: productIds.map((productId: string, index: number) => ({
                    product: {
                        connect: {
                            id: productId,
                        },
                    },
                    quantity: qtysProductChek[index],
                    size: productsChekout[index].size || ''
                }))
            }
        }
    })
    
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/checkout?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/checkout?canceled=1`,
        metadata: {
            orderId: order.id,
        }
    })

    return NextResponse.json({ url: session.url }, {
        headers: corsHeaders
    })
}