'use client'

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SizeColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface SizesClientProps {
    data: SizeColumn[]
}

export const SizesClient: React.FC<SizesClientProps> = ({
    data
}) => {
    
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Tallas (${data.length})`} description="Administra las tallas de la tienda" />
                <Button className="text-xs" onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Talla
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
            <Heading title="API" description="API para llamar las tallas" />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId" />
        </>
    )
}