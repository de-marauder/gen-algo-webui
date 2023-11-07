'use client'
import { useContext, useEffect } from 'react';
import ContextStore from '@/app/_components/store/context'
import Loading from '@/app/(Home)/loading'
import { Sidebar } from '../../_components/Nav/Sidebar'
import { TopBar } from '../../_components/Nav/TopBar'
import { Blur } from '../../_components/utils/Blur'
import { Notifications } from '../Notifications/Notifications';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/app/_services/notificationSetup';
import axios from 'axios';
import { APIConfig } from '@/app/(Dashboard)/dashboard/config/_helper';

export const Component: React.FC<{ children: React.ReactNode }> = function ({ children }) {
  const { swr, user, notifications, updateNotifCounter } = useContext(ContextStore)

  if (messaging && swr) {
    onMessage(messaging, async (payload) => {
      // new Notification(payload.notification?.title || 'Message received', payload.notification);
      swr.showNotification(payload.notification?.title || 'Message received', payload.notification);
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, APIConfig)
        .then((data: { data: { data: {}[] } }) => {
          const n = data.data.data.length;
          updateNotifCounter(n)
          window.localStorage.setItem('notif-counter', n.toString())
        })

    });
  }

  return (
    <>
      {user ?
        <>
          <TopBar />
          <main className='h-[100vh] flex max-sm:gap-2 gap-4 max-sm:pr-0 pr-4 overflow-y-scroll'>
            <Sidebar />
            <div className="pt-[4rem] min-h-[80vh] grow pl-[3.5rem] max-sm:pr-2 sm:pl-[11rem] max-sm:w-[100vw] max-sm:overflow-x-clip">
              <div className='flex flex-col items-center justify-between overflow-x-hidden'>
                <Blur />
              </div>
              <div className='h-[100vh]'>
                {children}
              </div>
            </div>
            {notifications ? <Notifications /> : null}
          </main>
        </> : <Loading />
      }
    </>
  )
}