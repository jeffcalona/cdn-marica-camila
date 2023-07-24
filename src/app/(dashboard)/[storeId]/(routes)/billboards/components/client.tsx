'use client'

import { Plus } from "lucide-react"
import { Billboard } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"

interface BillboardClientProps {
    data: Billboard[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {
    
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Tableros (${data.length})`} description="Administra las imagenes de inicio de la tienda" />
                <Button className="text-xs" onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar nuevo
                </Button>
            </div>
            <Separator />
        </>
    )
}