"use client"
import { sidebarLinks } from "@/constants/index"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"

const Sidebar = () => {
    const pathName = usePathname()
  return (
      <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
          <div className="flex flex- flex-col gap-6">
              {
                  sidebarLinks.map((link) => {
                      const isActive = pathName === link.route
                      return (
                          <Link key={link.lable} href={link.route} className={cn("flex gap-4 items-center p-4 rounded-lg justify-start", { "bg-blue-1": isActive })}>
                              <Image src={link.imgUrl} alt={link.lable} width={24} height={24} />
                              <p className="text-lg font-semibold max-lg:hidden">{ link.lable}</p>
                          </Link>
                      )
                }) 
              }
          </div>
    </section>
  )
}

export default Sidebar
