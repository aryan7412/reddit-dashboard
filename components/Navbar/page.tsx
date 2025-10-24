'use client'

import { useState } from "react"
import { Home, Tally1, MoveUp, Mail, MessageSquare, Menu, X } from "lucide-react"
import { ModeToggle } from "@/components/ModeToggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FaReddit } from "react-icons/fa"
import UserMenu from "@/components/Usermenu"
import SearchBar from "@/components/SearchBar"

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className="w-full bg-background">
            <div className="flex items-center justify-between px-6 py-2">
                {/* Left side */}
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <div className="flex items-center gap-2">
                        <FaReddit color="#ff4400" className="h-8 w-8" />
                        <span className="text-[1.75rem] font-bold tracking-tighter">
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
                </div>

                {/* Center section — visible only on lg and above */}
                <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
                    {/* Home */}
                    <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                        <Home className="h-5 w-5" />
                        <p className="mt-1">Home</p>
                    </div>

                    {/* Popular */}
                    <div className="flex items-center cursor-pointer">
                        <div className="flex items-center text-[#ff4400]">
                            <Tally1 className="h-2 mt-[0.5rem]" strokeWidth={7} />
                            <Tally1 className="h-3 mt-[0.34rem] -ml-[1.12rem]" strokeWidth={5} />
                            <MoveUp className="h-4 -ml-[1.43rem]" strokeWidth={4} />
                        </div>
                        <p className="text-[#ff4400] font-bold mt-1 -ml-1">Popular</p>
                    </div>

                    {/* All */}
                    <div className="flex items-center cursor-pointer">
                        <div className="flex items-center">
                            <Tally1 className="h-[0.7rem] mt-[0.32rem]" strokeWidth={6} />
                            <MoveUp className="h-4 -ml-[1.4575rem] mt-[0.03rem]" strokeWidth={4} />
                            <Tally1 className="h-[0.7rem] -ml-[1rem] mt-[0.32rem]" strokeWidth={6} />
                        </div>
                        <p className="mt-1 -ml-1.5">All</p>
                    </div>

                    {/* Search Bar */}
                    <SearchBar />

                    {/* Create Post */}
                    <Button className="bg-[#ff4400] hover:bg-[#e53e00] text-white h-8 rounded-md px-3">
                        Create Post
                    </Button>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-6">
                    {/* Notification */}
                    <div className="relative cursor-pointer hidden lg:flex">
                        <MessageSquare size={20} />
                        <span className="absolute top-0 left-0 w-3 h-3 bg-[#ff4400] border-2 border-white rounded-full -translate-x-1/4 -translate-y-1/4"></span>
                    </div>

                    {/* Mail */}
                    <Mail className="h-5 w-5 cursor-pointer hidden lg:flex" />

                    {/* User */}
                    <div className="hidden lg:flex">
                        <UserMenu />
                    </div>

                    {/* Hamburger / Close button for sm & md */}
                    <div className="lg:hidden">
                        {menuOpen ? (
                            <X
                                className="h-6 w-6 cursor-pointer"
                                onClick={() => setMenuOpen(false)}
                            />
                        ) : (
                            <Menu
                                className="h-6 w-6 cursor-pointer"
                                onClick={() => setMenuOpen(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
            {/* Mobile / Tablet Dropdown - MODIFIED */}
            {menuOpen && (
                <div className="lg:hidden flex flex-col items-center gap-4 py-4 border-t animate-in fade-in duration-200">
                    <div className="flex flex-col items-center gap-4 text-sm font-medium w-full">
                        {/* 1. Home, Popular, All on one line */}
                        <div className="flex justify-center gap-8 px-6 w-full">
                            <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
                                <Home className="h-5 w-5" />
                                <p className="mt-1">Home</p>
                            </div>

                            <div className="flex items-center cursor-pointer">
                                <div className="flex items-center text-[#ff4400]">
                                    <Tally1 className="h-2 mt-[0.5rem]" strokeWidth={7} />
                                    <Tally1 className="h-3 mt-[0.34rem] -ml-[1.12rem]" strokeWidth={5} />
                                    <MoveUp className="h-4 -ml-[1.43rem]" strokeWidth={4} />
                                </div>
                                <p className="text-[#ff4400] font-bold mt-1 -ml-1">Popular</p>
                            </div>

                            <div className="flex items-center cursor-pointer">
                                <div className="flex items-center">
                                    <Tally1 className="h-[0.7rem] mt-[0.32rem]" strokeWidth={6} />
                                    <MoveUp className="h-4 -ml-[1.4475rem] mt-[0.03rem]" strokeWidth={4} />
                                    <Tally1 className="h-[0.7rem] -ml-[1rem] mt-[0.3rem]" strokeWidth={6} />
                                </div>
                                <p className="mt-1 -ml-1.5">All</p>
                            </div>
                        </div>

                        {/* 2. Centered Search Bar */}
                        <SearchBar />

                        {/* 3. Create Post Button */}
                        <Button className="bg-[#ff4400] hover:bg-[#e53e00] text-white h-8 rounded-md px-3 w-[90%] sm:w-[80%]">
                            Create Post
                        </Button>

                        {/* 4. Icons in one line (centered by parent container) */}
                        <div className="flex items-center gap-8 mt-2">
                            <div className="relative cursor-pointer lg:hidden">
                                <MessageSquare size={20} />
                                <span className="absolute top-0 left-0 w-3 h-3 bg-[#ff4400] border-2 border-white rounded-full -translate-x-1/4 -translate-y-1/4"></span>
                            </div>
                            <Mail className="h-5 w-5" />
                            <UserMenu />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar