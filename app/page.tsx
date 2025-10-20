import React from 'react'
import Navbar from "@/components/Navbar/page"
import RedditPostCardList from "@/components/RedditPostCardList/page"
import FilterSection from "@/components/FilterSection/page"

const page = () => {
  return (
    <div >
      <Navbar /> 
      <div className='flex mx-2.5 gap-2.5 bg-gray-300'>
        <div className='h-full w-[20.3125rem]'><FilterSection /></div>
        <div className='h-full w-[59.375rem]'><RedditPostCardList /></div>
        <div className='h-full w-[20.3125rem]'></div>
      </div>
      
      
    </div>
  )
}

export default page