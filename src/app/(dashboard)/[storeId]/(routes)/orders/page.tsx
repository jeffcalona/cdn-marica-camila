import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"
import { format } from "date-fns"

import { OrderClient } from "./components/client"
import { OrderColumn } from "./components/columns"

const OrdersPage = async ({
    params
}: {
    params: { storeId: string }
}) => {

    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
    })

    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        address: item.address,
        customer: item.customer,
        products: item.orderItems.map((orderItem) => `${orderItem.quantity} ${orderItem.product.name} ${orderItem.size}`).join(', '),
        qtyOrder: item.orderItems.map((orderItem) => orderItem.quantity).join(', '),
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + (Number(item.product.price) * item.quantity)
        }, 0)),
        status: item.status,
        createdAt: format(item.createdAt, "dd, MMM, yyyy")
    }))

    return (
        <main className="flex-col">
            <section className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders} />
            </section>
        </main>
    )
}

export default OrdersPage

//Antes de modificar para que Producto contenga catidad, nombre y talla,
//Nombre sea --> Cliente y contenga Nombre, teléfono e email... y
//Pagado sea --> Estatus, y cambie entre Sin pago, pagado

// import prismadb from "@/lib/prismadb"
// import { formatter } from "@/lib/utils"
// import { format } from "date-fns"

// import { OrderClient } from "./components/client"
// import { OrderColumn } from "./components/columns"

// const OrdersPage = async ({
//     params
// }: {
//     params: { storeId: string }
// }) => {

//     const orders = await prismadb.order.findMany({
//         where: {
//             storeId: params.storeId
//         },
//         include: {
//             orderItems: {
//                 include: {
//                     product: true,
//                 },
//             }
//         },
//         orderBy: {
//             createdAt: 'desc'
//         },
//     })

//     const formattedOrders: OrderColumn[] = orders.map((item) => ({
//         id: item.id,
//         phone: item.phone,
//         address: item.address,
//         name: item.name,
//         email: item.email,
//         products: item.orderItems.map((orderItem) => `${orderItem.quantity} ${orderItem.product.name}`).join(', '),
//         qtyOrder: item.orderItems.map((orderItem) => orderItem.quantity).join(', '),
//         totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
//             return total + (Number(item.product.price) * item.quantity)
//         }, 0)),
//         isPaid: item.isPaid,
//         createdAt: format(item.createdAt, "dd, MMM, yyyy")
//     }))

//     return (
//         <main className="flex-col">
//             <section className="flex-1 space-y-4 p-8 pt-6">
//                 <OrderClient data={formattedOrders} />
//             </section>
//         </main>
//     )
// }

// export default OrdersPage