import React from 'react'
import Navbar from "@/components/Navbar/page"
import RedditPostCardList from "@/components/RedditPostCardList/page"
import FilterSection from "@/components/FilterSection/page"
import AdvertisementSection from "@/components/AdvertisementSection/page"

const page = () => {
  return (
    <div className='overflow-hidden'>
      <Navbar /> 
      <div className='mx-auto max-w-screen-2xl px-1 sm:px-3 lg:px-4'>
        <div className='flex flex-col lg:flex-row'>
          {/* Left sidebar (filters) */}
          <div className='hidden lg:block lg:w-64 xl:w-90 2xl:w-80'><FilterSection /></div>

          {/* Main content */}
          <div className='w-full rounded-2xl bg-card mt-4'><RedditPostCardList /></div>

          {/* Right sidebar (ads) */}
          <div className='hidden xl:block xl:w-88 2xl:w-72'><AdvertisementSection /></div>
        </div>
      </div>
    </div>
  )
}

export default page