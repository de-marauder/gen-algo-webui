'use client'

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation'
import { TypeUser } from "@/Types/User";

import React from 'react';
import ContextStore from "../store/context";

// var window : Window

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
  const [notifCounter, setNotifCounter] = useState(0)
  const updateNotifCounter = (count: number) => {
    setNotifCounter(count)
    window.localStorage?.setItem('notif-counter', count.toString())
  }
  const [swr,  setSWR] = useState<ServiceWorkerRegistration | null>(null);
  const updateSWR = (swr: ServiceWorkerRegistration) => {
    setSWR(swr)
  }

  useEffect(() => {
    (async()=>{
      updateSWR(await navigator.serviceWorker.register('/firebase-messaging-sw.js'))
    })();
  }, []);
  useEffect(() => {
    updateNotifCounter(+(window.localStorage.getItem('notif-counter') || 0))
  }, []);

  useEffect(() => {
    // check if token still exist (not logged out)
    const u = window.localStorage.getItem('site-user');
    if (!u) {
      if (pathname !== '/auth/login' && pathname !== '/auth/signup') {
        router.push('/')
      }
    } else {
      setUser(JSON.parse(u) as TypeUser);

    }
  }, [router, pathname])

  return (
    <>
      <ContextStore.Provider value={{ user, updateUser, notifications, updateNotification, notifCounter, updateNotifCounter, swr, updateSWR }}>
        {children}
      </ContextStore.Provider>
    </>
  )
}