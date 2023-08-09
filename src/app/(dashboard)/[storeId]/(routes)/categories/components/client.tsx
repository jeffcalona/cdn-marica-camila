'use client'

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { CategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface CategoryClientProps {
    data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
    data
}) => {
    
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Categorías (${data.length})`} description="Administra las categorías de la tienda" />
                <Button className="text-xs" onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Categoría
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API para llamar las categorías" />
            <Separator />
            <ApiList entityName="categories" entityIdName="categoryId" />
        </>
    )
}