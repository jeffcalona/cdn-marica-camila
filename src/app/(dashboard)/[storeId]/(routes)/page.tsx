import { CreditCardIcon, EuroIcon, Package } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { formatter } from "@/lib/utils"
import { getSalesCount } from "@/actions/get-sales-count"
import { getTotalSalesMade } from "@/actions/get-total-salesMade"
import { getStockProdcutsCount } from "@/actions/get-stockProducts-count"
import { getStockClothesCount } from "@/actions/get-stockClothes-count"
import { SalesPerMonthChart } from "@/components/charts/sales-perMonth-chart"
import { getChartSaleMadePerMonth } from "@/actions/get-chart-salesMade-perMonth"


interface DashboardPageProps {
    params: { storeId: string }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({
    params
 }) => {

    const totalSalesMade = await getTotalSalesMade(params.storeId)
    const salesCount = await getSalesCount(params.storeId)
    const stockProductsCount = await getStockProdcutsCount(params.storeId)
    const stockClothesCount = await getStockClothesCount(params.storeId)
    const chartSalesPerMonth = await getChartSaleMadePerMonth(params.storeId)

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Vista General" description="Visión general de la tienda" />
                <Separator />
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total ventas realizadas
                            </CardTitle>
                            <EuroIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalSalesMade)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Número de ventas
                            </CardTitle>
                            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {salesCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Productos en stock
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex justify-between">
                                <div className="flex w-[45%] flex-col items-center">
                                    {stockClothesCount}
                                    <p className="font-light text-xs">Ropa</p>
                                </div>
                                <div className="flex w-[45%] flex-col items-center">
                                    {stockProductsCount}
                                    <p className="font-light text-xs">Productos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Gráfico de ventas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SalesPerMonthChart data={chartSalesPerMonth} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage