import Stripe from "stripe";
import { headers } from "next/headers"
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session
    const address = session?.customer_details?.address

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ]

    const addressString = addressComponents.filter((c) => c !== null).join(", ")

    if(event.type === "checkout.session.completed") {
        const order = await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                status: 'Pagado',
                address: addressString,
                customer:
                    [
                        session?.customer_details?.name || '',
                        session?.customer_details?.phone || '',
                        session?.customer_details?.email || ''
                    ].join(' ')
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    }
                },
            },
        })

        const productQty = order.orderItems.map((orderItem) => orderItem.quantity)

        productQty.forEach(async (quantity, index) => {
            const productId = order.orderItems[index].productId

            await prismadb.product.updateMany({
                where: {
                    id: productId
                },
                data: {
                    quantity: {
                        decrement: quantity
                    },
                }
            })
        })
    }

    return new NextResponse(null, { status: 200 })
} 



// import Stripe from "stripe";
// import { headers } from "next/headers"
// import { NextResponse } from "next/server";

// import { stripe } from "@/lib/stripe"
// import prismadb from "@/lib/prismadb";

// export async function POST(req: Request) {
//     const body = await req.text()
//     const signature = headers().get("Stripe-Signature") as string

//     let event: Stripe.Event

//     try {
//         event = stripe.webhooks.constructEvent(
//             body,
//             signature,
//             process.env.STRIPE_WEBHOOK_SECRET!
//         )
//     } catch (error: any) {
//         return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
//     }

//     const session = event.data.object as Stripe.Checkout.Session
//     const address = session?.customer_details?.address

//     const addressComponents = [
//         address?.line1,
//         address?.line2,
//         address?.city,
//         address?.state,
//         address?.postal_code,
//         address?.country
//     ]

//     const addressString = addressComponents.filter((c) => c !== null).join(', ')

//     if(event.type === "checkout.session.completed") {
//         const order = await prismadb.order.update({
//             where: {
//                 id: session?.metadata?.orderId,
//             },
//             data: {
//                 isPaid: true,
//                 address: addressString,
//                 phone: session?.customer_details?.phone || '',
//             },
//             include: {
//                 orderItems: {
//                     include: {
//                         product: true
//                     }
//                 },
//             }
//         })

//         const productIds = order.orderItems.map((orderItem) => orderItem.productId)
//         const productQty = order.orderItems.map((orderItem) => orderItem.product.quantity)

//         productQty.forEach(async (quantity, index) => {
//             const productId = order.orderItems[index].productId

//             await prismadb.product.updateMany({
//                 where: {
//                     id: productId
//                 },
//                 data: {
//                     quantity: {
//                         decrement: quantity
//                     }
//                 }
//             })
//         })

//         // await prismadb.product.updateMany({
//         //     where: {
//         //         id: {
//         //             in: [...productIds]
//         //         }
//         //     },
//         //     data: {
//         //         quantity: {
//         //             decrement: productQty[]
//         //         }
//         //     }
//         // })
//     }

//     return new NextResponse(null, { status: 200 })
// } 