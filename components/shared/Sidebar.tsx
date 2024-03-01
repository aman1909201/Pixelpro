"use client";
import { navLinks } from '@/constants';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { Button } from '../ui/button';


const Sidebar = () => {
    const pathname=usePathname()
    return (
        <aside className='sidebar'>
            <div className=' flex size-full flex-col gap-4'>
                <Link href={'/'} className='sidebar-logo'>
                    <Image src='/pixel.png' alt='logo' width={18} height={28} />
                </Link>

                <nav className='sidebar-nav'>
                    <SignedIn>
                        <ul className="sidebar-nav_elements" >
                           {navLinks.slice(0,6).map((link)=>{
                            const isactive = link.route===pathname
                            return(
                                <li key={link.route} className={`sidebar-nav_element group ${isactive ? 'bg-purple-600 text-green-300':'text-gray-700'}`}>
                                <Link className='sidebar-link' href={link.route}>
                                    {link.label}
                                </Link>
                                </li>
                            )
                           })}
                           </ul>
                           <ul className="sidebar-nav_elements" >
                           {navLinks.slice(6,9).map((link)=>{
                            const isactive = link.route===pathname
                            return(
                                <li key={link.route} className={`sidebar-nav_element group ${isactive ? 'bg-purple-600 text-green-300':'text-gray-700'}`}>
                                <Link className='sidebar-link' href={link.route}>
                                    {link.label}
                                </Link>
                                </li>
                            )
                           })}
                           <li className=' cursor-pointer p-4 gap-2'>
                            <UserButton afterSignOutUrl='/' showName/>
                           </li>
                        </ul>
                    </SignedIn>

                    <SignedOut>
                        <Button asChild className='button bg-orange-400 bg-cover'>
                            <Link href="\signin">Login</Link>
                        </Button>
                    </SignedOut>
                </nav>

            </div>
        </aside>
    )
}

export default Sidebar