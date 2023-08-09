"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export type CategoryColumn = {
  id: string
  name: string
  billboardLabel: string,
  imageUrl: string,
  createdAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: 'name',
    header: "Nombre",
  },
  {
    accessorKey: 'imageUrl',
    header: "Imagen",
    cell: ({ row }) => (
      <div className="w-10 h-10">
        <img src={row.original.imageUrl} alt="categoryImg" className="w-full h-full object-cover" />
      </div>
    )
  },
  {
    accessorKey: 'billboardLabel',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tablero
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: 'createdAt',
    header: "Fecha",
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
