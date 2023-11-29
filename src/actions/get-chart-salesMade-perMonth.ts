import prismadb from "@/lib/prismadb"

interface ChartData {
    name: string,
    total: number
}

export const getChartSaleMadePerMonth = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            status: 'Pagado', 
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    })

    const monthlySales: { [key: number]: number } = {}

    for(const order of paidOrders) {
        const month = order.createdAt.getMonth()
        let saleForOrder = 0

        for(const item of order.orderItems) {
            saleForOrder += item.product.price.toNumber()
        }
        monthlySales[month] = (monthlySales[month] || 0) + saleForOrder
    }
    
    const chartData: ChartData[] = [
        { name: 'ene', total: 0 },
        { name: 'feb', total: 0 },
        { name: 'mar', total: 0 },
        { name: 'abr', total: 0 },
        { name: 'may', total: 0 },
        { name: 'jun', total: 0 },
        { name: 'jul', total: 0 },
        { name: 'ago', total: 0 },
        { name: 'sep', total: 0 },
        { name: 'oct', total: 0 },
        { name: 'nov', total: 0 },
        { name: 'dic', total: 0 },
    ]

    for (const month in monthlySales) {
        chartData[parseInt(month)].total = monthlySales[parseInt(month)]
    }
    
    return chartData
}