"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
  id: string
  address: string,
  status: string,
  totalPrice: string,
  customer: string,
  products: string,
  createdAt: string,
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'products',
    header: "Productos",
  },
  {
    accessorKey: 'customer',
    header: "Cliente",
  },
  {
    accessorKey: 'address',
    header: "Dirección",
  },
  {
    accessorKey: 'totalPrice',
    header: "Pago Total",
  },
  {
    accessorKey: 'status',
    header: "Estatus",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-1">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: row.original.status === 'Pagado' ? '#42CE30' : '#DA3131' }}/>
        {row.original.status}
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
  }
]
