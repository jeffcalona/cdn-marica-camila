import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/columns"
import { formatter } from "@/lib/utils"

const ProductsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            color: true,
            sizes: true,
            billboard: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    
    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        descriptionLong: item.descriptionLong,
        descriptionSmall: item.descriptionSmall,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.sizes.map((size) => size.sizenew),
        color: item.color.value,
        billboard: item.billboard.label,
        createdAt: format(item.createdAt, "dd, MMM, yyyy")
    }))

    return (
        <main className="flex-col">
            <section className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </section>
        </main>
    )
}

export default ProductsPage