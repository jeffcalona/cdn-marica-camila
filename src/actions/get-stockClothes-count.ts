import prismadb from "@/lib/prismadb"

export const getStockClothesCount = async (storeId: string) => {
    const stockClothesCount = await prismadb.product.count({
        where: {
            storeId,
            billboardId: 'c716bbf1-5d3a-4421-a779-b163b2bc45a2'
        }
    })
    return stockClothesCount
}