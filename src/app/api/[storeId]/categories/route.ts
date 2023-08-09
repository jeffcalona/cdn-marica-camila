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

        const { name, billboardId, imageUrl } = body

        if(!userId) {
            return new NextResponse('No autenticado', { status: 401 })
        }

        if(!name) {
            return new NextResponse('El nombre de la categoría es requerida', { status: 400 })
        }

        if(!imageUrl) {
            return new NextResponse('La imagen de portada es requerida', { status: 400 })
        }

        if(!billboardId) {
            return new NextResponse('El Id del tablero es requerido', { status: 400 })
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

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORIES_POST]', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url)
        const billboardId = searchParams.get("billboardId") || undefined

        if (!params.storeId) {
            return new NextResponse('El Id de la tienda es requerido', { status: 400 })
        }

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId,
                billboardId
            }
        })

        return NextResponse.json(categories)

    } catch (error) {
        console.log('[CATEGORIES_GET]', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}