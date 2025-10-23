import React from 'react'
import { Circle } from "lucide-react"
import { FaReddit } from "react-icons/fa"
import { PiDotsNineThin } from "react-icons/pi";
import Image from 'next/image';

// An array of the link names to be displayed in the grid
const mainLinks = [
    'About', 'Advertise', 'Reddit App',
    'Careers', 'Help', 'Reddit Gold',
    'Press', 'Blog', 'Reddit Hits'
];

const page = () => {
    return (
        <div className='bg-transparent ml-4'>
            {/* Card1- About Sale */}
            <div className=''>
                <Image
                    src="/SaleImages/RIghtSectionSale.png"
                    alt='Sale Image'
                    height={150}
                    width={250}
                    className='pt-5 mx-auto h-52 w-60 md:h-56 md:w-64'
                />
            </div>
            {/* Advertise */}
            <div className='mt-5 relative bg-card border h-46 w-full max-w-[15rem] mx-auto overflow-hidden'>
                <div className='flex gap-28 absolute translate-z-5'>
                    <div><PiDotsNineThin className='text-muted h-15 w-15' strokeWidth={4} /></div>
                </div>
                <div className="absolute -top-10 -right-7 translate-z-10">
                    <Circle className="text-muted h-25 w-25" strokeWidth={1.5} />
                </div>

                <div className="flex items-center gap-2 translate-y-9.5 translate-x-16">
                    <FaReddit color="#ff4400" className="h-8 w-8" />
                    <span className="text-[1.75rem] font-bold tracking-tighter text-foreground">
                        <span>redd</span>
                        <span className="relative">
                            i
                            <span
                                className="absolute w-[6px] h-[6px] bg-[#ff4400] rounded-full"
                                style={{ left: '60%', transform: 'translateX(-50%)', top: '5.2px' }}
                            ></span>
                        </span>
                        <span>t</span>
                    </span>
                </div>

                <div className='translate-x-13 translate-y-10 text-foreground'>Advertise on Reddit</div>
                <button className="translate-x-6 translate-y-14 text-[#ff4400] font-bold text-sm py-2 px-10 rounded-sm border-2 border-[#ff4400] transition-all duration-300 ease-in-out hover:bg-[#ff4400] hover:text-white cursor-pointer">
                    GET STARTED
                </button>
            </div>

            {/* Footer */}
            <div className="rounded-lg max-w-md w-full mt-36 mx-auto">
                <hr className='mb-4 border-border' />
                <ul className="grid grid-cols-3 gap-y-4 mb-4">
                    {mainLinks.map((link, index) => (
                        <li key={index} className="flex items-center text-[0.75rem]">
                            <span className="text-muted-foreground mr-1">•</span>
                            <a href="#" className="text-foreground hover:underline">
                                {link}
                            </a>
                        </li>
                    ))}
                </ul>
                <hr className='mb-4 border-border' />
                {/* Copyright and legal links */}
                <div className="flex justify-between items-center text-[0.8rem] text-muted-foreground font-medium">
                    <p>&copy; 2020</p>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="hover:underline">Privacy</a>
                        <a href="#" className="hover:underline">Terms</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page