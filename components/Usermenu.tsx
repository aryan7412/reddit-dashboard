"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"

export default function UserMenu() {
  const { data: session } = useSession()

  const userName = session?.user?.name ?? "User"
  const userEmail = session?.user?.email ?? "Not signed in"
  const userImage =
    session?.user?.image ?? "https://github.com/shadcn.png"
  const userInitial = userName?.charAt(0).toUpperCase() ?? "?"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar>
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="end">
        {session ? (
          <>
            <DropdownMenuLabel>
              Signed in as <br />
              <span className="font-medium">{userEmail}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => signIn("google")}>
              Sign in with Google
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signIn("github")}>
              Sign in with GitHub
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
