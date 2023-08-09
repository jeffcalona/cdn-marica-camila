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

        const { name, value } = body

        if(!userId) {
            return new NextResponse('No autenticado', { status: 401 })
        }

        if(!name) {
            return new NextResponse('El nombre del color es requerido', { status: 400 })
        }

        if(!value) {
            return new NextResponse('El valor del color es requerido', { status: 400 })
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

        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId

            }
        })

        return NextResponse.json(color)

    } catch (error) {
        console.log('[COLORS_POST]', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {

        if (!params.storeId) {
            return new NextResponse('El Id de la tienda es requerido', { status: 400 })
        }

        const colors = await prismadb.color.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(colors)

    } catch (error) {
        console.log('[COLORS_GET]', error)
        return new NextResponse('Error interno', { status: 500 })
    }
}