import { Collection } from '@/components/shared/Collections'
import { navLinks } from '@/constants'
import { getAllImages } from '@/lib/actions/image.actions'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Home = async ({searchParams}: SearchParamProps) => {
  const page=Number(searchParams?.page) || 1;
  const searchQuery=(searchParams?.query as string) || '';

  const images = await getAllImages({page, searchQuery}) 

  return (
    <>
    <section className='home'>
      <h1 className='home-heading'>Create Images with Pixelpro</h1>
      <ul className='flex-center w-full gap-2'>
    
      </ul>
    </section>
    <section className='sm:mt-12'>
      <Collection 
      hasSearch={true}
      images={images?.data}
      totalPages={images?.totalpage}
      page={page}
      />
    </section>
    </>
  )
}

export default Home