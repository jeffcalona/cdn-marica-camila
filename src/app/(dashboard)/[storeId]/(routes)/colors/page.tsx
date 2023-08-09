import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

import { ColorsClient } from "./components/client"
import { ColorColumn } from "./components/columns"

const ColorsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedColor: ColorColumn[] = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "dd, MMM, yyyy")
    }))

    return (
        <main className="flex-col">
            <section className="flex-1 space-y-4 p-8 pt-6">
                <ColorsClient data={formattedColor} />
            </section>
        </main>
    )
}

export default ColorsPage