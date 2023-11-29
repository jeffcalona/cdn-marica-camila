import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        console.log('body: ', body)

        const { name, descriptionLong, descriptionSmall, price, quantity, categoryId, colorId, sizes, images, billboardId } = body

        if(!userId) {
            return new NextResponse('No autenticado', { status: 401 })
        }

        if(!name) {
            return new NextResponse('El nombre del producto es requerido', { status: 400 })
        }

        if(!descriptionLong) {
            return new NextResponse('La descripción larga del producto es requerida', { status: 400 })
        }

        if(!descriptionSmall) {
            return new NextResponse('La descripción corta del producto es requerida', { status: 400 })
        }

        if(!price) {
            return new NextResponse('El precio del producto es requerido', { status: 400 })
        }

        if(!quantity) {
            return new NextResponse('La cantidad de productos es requerida', { status: 400 })
        }

        if(!categoryId) {
            return new NextResponse('El Id de la categoría es requerido', { status: 400 })
        }

        if(!billboardId) {
            return new NextResponse('El Id del tablero es requerido', { status: 400 })
        }

        if(!colorId) {
            return new NextResponse('El Id del color es requerido', { status: 400 })
        }

        if(!sizes || !sizes.length) {
            return new NextResponse('Las tallas son requeridas', { status: 400 })
        }

        if(!images || !images.length) {
            return new NextResponse('Las imágenes son requeridas', { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse('El Id de la tienda es requerido', { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        //Cuando el usuario está logeado pero no tiene los permisos para modificar el tablero
        if (!storeByUserId) {
            return new NextResponse('No autorizado', { status: 403 })
        }

        const product = await prismadb.product.create({
            data: {
                name,
                descriptionLong,
                descriptionSmall,
                price,
                quantity,
                categoryId,
                billboardId,
                colorId,
                storeId: params.storeId,
                sizes: {
                    createMany: {
                        data: [
                            ...sizes.map((sizenew: string) => ({sizenew}))
                        ]
                    }
                },
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },

            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCTS_POST]', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const billboardId = searchParams.get("billboardId") || undefined
        const colorId = searchParams.get("colorId") || undefined

        const limit = searchParams.get("_limit") || undefined

        if (!params.storeId) {
            return new NextResponse('El Id de la tienda es requerido', { status: 400 })
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                billboardId,
                colorId,
            },
            include: {
                images: true,
                category: true,
                billboard: true,
                color: true,
                sizes: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: Number(limit) || undefined
        })
        
        return NextResponse.json(products)

    } catch (error) {
        console.log('[PRODUCTOS_GET]', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}