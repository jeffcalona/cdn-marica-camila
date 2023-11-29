'use client'

import { useParams, usePathname } from "next/navigation"

import { Store } from "@prisma/client"
import MenuIcon from "./icons/menuIcon"
import { Button } from "./ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import Link from "next/link"
import { cn } from "@/lib/utils"

type SheetTriggerProps = React.ComponentPropsWithRef<typeof SheetTrigger>

interface StoreDataProps extends SheetTriggerProps {
    items: Store[]
}

const MenuMobile = ({
    items = []
}: StoreDataProps ) => {

    const params = useParams()
    const pathname = usePathname()

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Inicio',
            active: pathname === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Tablero',
            active: pathname === `/${params.storeId}/billboards`
        },
        {
            href: `/${params.storeId}/products`,
            label: 'Productos',
            active: pathname === `/${params.storeId}/products`
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'Pedidos',
            active: pathname === `/${params.storeId}/orders`
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Categorías',
            active: pathname === `/${params.storeId}/categories`
        },
        {
            href: `/${params.storeId}/sizes`,
            label: 'Tallas',
            active: pathname === `/${params.storeId}/sizes`
        },
        {
            href: `/${params.storeId}/colors`,
            label: 'Colores',
            active: pathname === `/${params.storeId}/colors`
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Ajustes',
            active: pathname === `/${params.storeId}/settings`
        }
    ]

    const currentStore = items.find((item) => item.id === params.storeId)

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="px-2">
                    <MenuIcon strokeWidth='1.8' className="stroke-black dark:stroke-white" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{currentStore?.name}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 px-6 mt-8">
                    {routes.map((route) => (
                        <SheetClose key={route.label} asChild>
                            <Link href={route.href} className={cn('text-lg font-medium transition-colors hover:text-primary', route.active ? 'text-black dark:text-white' : 'text-muted-foreground')}>
                                {route.label}
                            </Link>
                        </SheetClose>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
export default MenuMobile