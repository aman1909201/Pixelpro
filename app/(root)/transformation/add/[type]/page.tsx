import Header from '@/components/shared/Header'
import Transformationform from '@/components/shared/Transformationform';
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';

import { redirect } from 'next/navigation';
import React from 'react'

const Addtransformationtype = async ({ params: { type } }:
  SearchParamProps) => {
  const { userId } = auth()
  const transformation = transformationTypes[type];
  if (!userId) redirect("/signin")
  const user = await getUserById(userId)
  return (
    <>
      <Header
        title={transformation.title}
        subTitle={transformation.subTitle}
      />

      <section className='mt-5'>
        <Transformationform
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          
        />
      </section>
    </>
  )
}

export default Addtransformationtype