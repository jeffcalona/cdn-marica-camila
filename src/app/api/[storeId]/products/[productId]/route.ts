import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET(
    req: Request,
    { params } : { params: { productId: string } }
) {
    try {

        if(!params.productId) {
            return new NextResponse('El id del producto es requerido', { status: 400 })
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                sizes: true,
                category: true,
                billboard: true,
                color: true
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('PRODUCT_GET', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params } : { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { name, descriptionLong, descriptionSmall, price, categoryId, billboardId, colorId, sizes, images } = body

        if(!userId) {
            return new NextResponse('No autenticado', { status: 401 })
        }

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

        if(!params.productId) {
            return new NextResponse('El id del tablero es requerido', { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        //Cuando el usuario está logeado pero no tiene los permisos para modificar el tablero
        if (!storeByUserId) {
            return new NextResponse('No autorizado')
        }

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                descriptionLong,
                descriptionSmall,
                price,
                categoryId,
                billboardId,
                colorId,
                images: {
                    deleteMany: {}
                },
                sizes: {
                    deleteMany: {}
                }
            }
        })

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
                sizes: {
                    createMany: {
                        data: [
                            ...sizes.map((sizenew: string) => ({sizenew}))
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('PRODUCT_PATCH', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params } : { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth()

        if(!userId) {
            return new NextResponse('No autenticado', { status: 401 })
        }

        if(!params.productId) {
            return new NextResponse('El id del producto es requerido', { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        //Cuando el usuario está logeado pero no tiene los permisos para modificar el tablero
        if (!storeByUserId) {
            return new NextResponse('No autorizado')
        }

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('PRODUCT_DELETE', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}