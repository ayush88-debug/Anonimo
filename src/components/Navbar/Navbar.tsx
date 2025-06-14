'use client';

import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isLoading, setIsLoading] = useState(false)

  const handleLogOut= ()=>{
    setIsLoading(true)
    try {
      signOut()
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-950 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Anonimo
        </Link>

        {/* Authenticated Section */}
        {session?.user ? (
          <div className="flex flex-row gap-x-10">
          <Link href="/dashboard">
            <Button className="bg-white hover:bg-slate-200 text-black cursor-pointer">
              Dashboard
            </Button>
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer hover:opacity-90">
                <AvatarFallback>
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-gray-900 text-white border border-gray-700 rounded-xl shadow-lg mt-2">
              <div className="space-y-5">
                <div className="text-sm">
                    <p className="font-medium text-gray-200 flex flex-wrap gap-x-1">
                        <span>Welcome,</span>
                        <span>{user?.username}</span>
                    </p>
                </div>
                <Button
                disabled={isLoading}
                  onClick={handleLogOut}
                  className="w-full bg-white hover:bg-slate-200 text-black cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Logging Out
                    </>
                  ) : (
                    "Logout"
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-white hover:bg-slate-200 text-black cursor-pointer">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
