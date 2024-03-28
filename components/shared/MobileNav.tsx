"use client";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { IoMdMenu } from "react-icons/io";
import { Button } from "../ui/button";

const MobileNav = () => {
    const pathname = usePathname()
    return (
        <header className="header">
            <Link href="/" className="flex items-center gap-2 md:py-2"></Link>

            <nav className="flex gap-2">
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                    <Sheet>
                        <SheetTrigger>
                            <IoMdMenu />
                        </SheetTrigger>
                        <SheetContent className="sm:w-64 sheet-content">
                            <>
                                {/*here we put image logo with width=152 and height=23 */}
                                <Image src="/svgimages/logo.svg" width={154} alt="logo" height={22}/>
                                <ul className="header-nav_elements" >
                                    {navLinks.map((link) => {
                                        const isactive = link.route === pathname
                                        return (
                                            <li key={link.route} className={`header-nav_element group ${isactive ? 'bg-purple-600 text-green-300' : 'text-gray-700'}`}>
                                                <Link className='sidebar-link cursor-pointer' href={link.route}>
                                                    {link.label}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </>
                        </SheetContent>
                    </Sheet>

                </SignedIn>
                <SignedOut>
                    <Button asChild className='button bg-orange-400 bg-cover'>
                        <Link href="\signin">Login</Link>
                    </Button>
                </SignedOut>
            </nav>
        </header>
    )
}

export default MobileNav