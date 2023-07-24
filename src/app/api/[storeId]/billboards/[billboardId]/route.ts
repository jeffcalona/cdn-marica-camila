import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET(
    req: Request,
    { params } : { params: { billboardId: string } }
) {
    try {

        if(!params.billboardId) {
            return new NextResponse('El id del tablero es requerido', { status: 400 })
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('BILLBOARD_GET', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params } : { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { imageOneUrl, imageTwoUrl } = body

        if(!userId) {
            return new NextResponse('No autenticado', { status: 401 })
        }

        if(!imageOneUrl) {
            return new NextResponse('La imagen de Ropa es requerida', { status: 400 })
        }

        if(!imageTwoUrl) {
            return new NextResponse('La imagen de Productos es requerida', { status: 400 })
        }

        if(!params.billboardId) {
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                imageOneUrl,
                imageTwoUrl
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('BILLBOARD_PATCH', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params } : { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth()

        if(!userId) {
            return new NextResponse('No autenticado', { status: 401 })
        }

        if(!params.billboardId) {
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('BILLBOARD_DELETE', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}