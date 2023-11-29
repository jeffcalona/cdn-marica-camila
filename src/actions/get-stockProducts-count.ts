import prismadb from "@/lib/prismadb";

export const getStockProdcutsCount = async (storeId: string) => {
    const stockProductsCount = await prismadb.product.count({
        where: {
            storeId,
            billboardId: 'fb48f415-e064-42c3-bda6-2670ba9789bd'
        }
    })
    
    return stockProductsCount
}