import prismadb from "@/lib/prismadb"
import { ProductForm } from "./components/product-form"

const ProductPage = async ({ 
    params 
}: {
    params: { productId: string, storeId: string }
}) => {

    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            images: true,
            sizes: true //esto es para decir que tambien voy a incluir las tallas que están en otro modelo
        }
    })

    //aquí llamo las categorías, tallas y colores que voy a usar en el form
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const sizes = await prismadb.size.findMany(({
        where: {
            storeId: params.storeId
        }
    }))

    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm initialData={product} categories={categories} sizes={sizes} colors={colors} billboards={billboards} />
            </div>
        </div>
    )
}

export default ProductPage