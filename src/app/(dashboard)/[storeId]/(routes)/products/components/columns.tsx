"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string,
  price: string,
  size: string[],
  category: string,
  billboard: string,
  color: string,
  quantity: number,
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: "Nombre",
  },
  {
    accessorKey: 'price',
    header: "Price",
  },
  {
    accessorKey: 'quantity',
    header: "Cantidad",
  },
  {
    accessorKey: 'size',
    header: "Talla",
  },
  {
    accessorKey: 'color',
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }}/>
      </div>
    )
  },
  {
    accessorKey: 'category',
    header: "Categoria",
  },
  {
    accessorKey: 'billboard',
    header: "Tablero",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
