import { UserButton, auth } from "@clerk/nextjs"

import { MainNav } from "@/components/main-nav"
import StoreSwitcher from "@/components/store-switcher"
import { redirect } from "next/navigation"
import prismadb from "@/lib/prismadb"
import MenuMobile from "./menuMobile"
import { ThemeToggle } from "@/components/theme-toggle"

const Navbar = async () => {

  const { userId } = auth()

  if(!userId) {
    redirect('/sign-in')
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId
    }
  })

  return (
    <header className="border-bn">
        <div className="flex h-16 items-center px-4">
            <StoreSwitcher items={stores} />
            <MainNav className="mx-6 md:block hidden" />
            <div className="ml-auto flex items-center">
              <div className="mr-2">
                <ThemeToggle />
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
            <div className="md:hidden flex items-center justify-center ml-2">
              <MenuMobile items={stores} />
            </div>
        </div>
    </header>
  )
}

export default Navbar