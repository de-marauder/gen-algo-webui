'use client'

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation'
import { TypeUser } from "@/Types/User";

import React from 'react';
import ContextStore from "../store/context";

export const AuthGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<TypeUser | null>(null);
  const pathname = usePathname();
  const updateUser = (user: TypeUser | null) => {
    setUser(user)
  }
  useEffect(() => {
    // check if token still exist (not logged out)
    const user = window.localStorage.getItem('site-user');
    if (!user) {
      if (pathname !== '/auth/login' && pathname !== '/auth/signup') {
        router.push('/')
      }
    } else {
      setUser(JSON.parse(user) as TypeUser);
      // fire alert
      const popUp = setTimeout(() => {

      }, 3000)

      return () => {
        clearTimeout(popUp)
      }
    }
  }, [router, pathname])

  return (
    <>
      <ContextStore.Provider value={{ user, updateUser }}>
        {/* Render the children and pass the user data as a prop */}
        {children}
      </ContextStore.Provider>
    </>
  )
}