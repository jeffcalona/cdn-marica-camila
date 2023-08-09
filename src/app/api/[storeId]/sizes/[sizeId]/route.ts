import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET(
    req: Request,
    { params } : { params: { sizeId: string } }
) {
    try {

        if(!params.sizeId) {
            return new NextResponse('El id de la talla es requerido', { status: 400 })
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log('SIZE_GET', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params } : { params: { storeId: string, sizeId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { name, value } = body

        if(!userId) {
            return new NextResponse('No autenticado', { status: 401 })
        }

        if(!name) {
            return new NextResponse('La descripción de la talla es requerida', { status: 400 })
        }

        if(!value) {
            return new NextResponse('La talla es requerida', { status: 400 })
        }

        if(!params.sizeId) {
            return new NextResponse('El id de la talla es requerido', { status: 400 })
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

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log('SIZE_PATCH', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params } : { params: { storeId: string, sizeId: string } }
) {
    try {
        const { userId } = auth()

        if(!userId) {
            return new NextResponse('No autenticado', { status: 401 })
        }

        if(!params.sizeId) {
            return new NextResponse('El id de la talla es requerido', { status: 400 })
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

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log('SIZE_DELETE', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}