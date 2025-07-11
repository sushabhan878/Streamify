
"use client"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
const MobileNav = () => {
    const pathName = usePathname()
    return (
        <section className="w-full max-w-[264px] px-4 py-2">
            <Sheet>
                <SheetTrigger asChild>
                    <Image src="/icons/hamburger.svg" alt="Hamburger menu" width={36} height={36} className="cursor-pointer sm:hidden" />
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-dark-1 px-6 py-4">
                    <SheetTitle hidden>Video Calling application</SheetTitle>
                    <Link href="/" className="flex items-center gap-3 mb-8">
                        <Image src="/icons/logo.svg" alt="Logo" height={32} width={32} className="max-sm:size-10" />
                        <p className="text-[26px] font-extrabold text-white">Yoom</p>
                    </Link>
                    <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
                        <SheetClose asChild>
                            <section className="flex h-full flex-col gap-6 pt-8 text-white">
                                {
                                    sidebarLinks.map((link) => {
                                        const isActive = pathName === link.route
                                        return (
                                            <SheetClose key={link.route} asChild>
                                                <Link key={link.label} href={link.route} className={cn("flex gap-4 items-center px-5 py-3 rounded-lg w-full max-w-60 transition-colors", { "bg-blue-1": isActive })}>
                                                    <Image src={link.imgURL} alt={link.label} width={20} height={20} />
                                                    <p className="font-semibold">{link.label}</p>
                                                </Link>
                                            </SheetClose>
                                        )
                                    })
                                }
                            </section>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav
