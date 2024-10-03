'use client'

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation'
import { TypeUser } from "@/Types/User";

import React from 'react';
import ContextStore from "../store/context";
import axios from "axios";
import { APIConfig } from "@/app/(Dashboard)/dashboard/config/_helper";
import { TypeConfig } from "@/Types/Config";

export const AuthGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<TypeUser | null>(null);
  const updateUser = (user: TypeUser | null) => {
    setUser(user)
  }
  const [configId, setConfigId] = useState<string>('');
  const updateConfigId = (configId: string) => {
    setConfigId(configId)
    localStorage.setItem('configId', configId);
  }
  const [configs, setConfigs] = useState<TypeConfig[]>([]);
  const updateConfigs = (configs: TypeConfig[]) => {
    setConfigs(configs)
  }
  const [configLoading, setConfigLoading] = useState<boolean>(false);
  const updateConfigLoading = (loading: boolean) => {
    setConfigLoading(loading)
  }
  const [configError, setConfigError] = useState<string>('');
  const updateConfigError = (error: string) => {
    setConfigError(error)
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
  const [swr, setSWR] = useState<ServiceWorkerRegistration | null>(null);
  const updateSWR = (swr: ServiceWorkerRegistration) => {
    setSWR(swr)
  }

  useEffect(() => {
    (async () => {
      updateSWR(await navigator.serviceWorker.register('/firebase-messaging-sw.js'))
    })();
  }, []);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, APIConfig)
      .then((data: { data: { data: [] } }) => {
        const notifCounter = data.data.data.length
        localStorage.setItem('notif-counter', notifCounter?.toString() || '0')
        updateNotifCounter(notifCounter)
      })

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

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/configs`;
    axios.get<{ data: TypeConfig[] }>(url, APIConfig)
      .then((response) => {
        updateConfigs(response.data.data)
      }).catch((error) => {
        console.log('configs gotten error => ', error)
      });
  }, [])

  useEffect(()=>{
    const configId = localStorage.getItem('configId') as string;
    if (configId) {
      updateConfigId(configId)
    } else {
      updateConfigId('')
    }
  })

  return (
    <>
      <ContextStore.Provider value={{
        user, updateUser,
        configId, updateConfigId,
        configs, updateConfigs,
        configLoading, updateConfigLoading,
        configError, updateConfigError,
        notifications, updateNotification,
        notifCounter, updateNotifCounter,
        swr, updateSWR
      }}>
        {children}
      </ContextStore.Provider>
    </>
  )
}