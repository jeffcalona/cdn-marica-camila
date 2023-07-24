import prismadb from "@/lib/prismadb"

import { BillboardClient } from "./components/client"

const BillboardPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <main className="flex-col">
            <section className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={billboards} />
            </section>
        </main>
    )
}

export default BillboardPage