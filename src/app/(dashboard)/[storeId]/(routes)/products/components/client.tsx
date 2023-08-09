'use client'

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { ProductColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface ProductClientProps {
    data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {
    
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Productos (${data.length})`} description="Administra los productos de la tienda" />
                <Button className="text-xs" onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Producto
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
            <Heading title="API" description="API para llamar el producto" />
            <Separator />
            <ApiList entityName="products" entityIdName="productId" />
        </>
    )
}