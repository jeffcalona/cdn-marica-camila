'use client'

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { ColorColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface ColorsClientProps {
    data: ColorColumn[]
}

export const ColorsClient: React.FC<ColorsClientProps> = ({
    data
}) => {
    
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Colores (${data.length})`} description="Administra los colores de la tienda" />
                <Button className="text-xs" onClick={() => router.push(`/${params.storeId}/colors/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Color
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
            <Heading title="API" description="API para llamar los colores" />
            <Separator />
            <ApiList entityName="colors" entityIdName="colorId" />
        </>
    )
}