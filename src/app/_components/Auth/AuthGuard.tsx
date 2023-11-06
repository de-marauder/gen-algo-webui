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
  const [notifications, setNotification] = useState(false)
  const updateNotification = (show: boolean) => {
    setNotification(show)
  }
  useEffect(() => {
    // check if token still exist (not logged out)
    const u = window.localStorage.getItem('site-user');
    console.log('use effect running: ', u)
    if (!u) {
      if (pathname !== '/auth/login' && pathname !== '/auth/signup') {
        router.push('/')
      }
    } else {
      setUser(JSON.parse(u) as TypeUser);
      // // fire alert
      // const popUp = setTimeout(() => {

      // }, 3000)

      // return () => {
      //   clearTimeout(popUp)
      // }
    }
  }, [router, pathname])

  return (
    <>
      <ContextStore.Provider value={{ user, updateUser, notifications, updateNotification }}>
        {/* Render the children and pass the user data as a prop */}
        {children}
      </ContextStore.Provider>
    </>
  )
}