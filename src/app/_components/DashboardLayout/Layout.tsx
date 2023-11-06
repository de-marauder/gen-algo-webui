'use client'
import { useContext, useEffect } from 'react';
import ContextStore from '@/app/_components/store/context'
import Loading from '@/app/(Home)/loading'
import { Sidebar } from '../../_components/Nav/Sidebar'
import { TopBar } from '../../_components/Nav/TopBar'
import { Blur } from '../../_components/utils/Blur'
import { Notifications } from '../Notifications/Notifications';
import { requestPermission } from '@/services/notificationSetup';

export const Component: React.FC<{ children: React.ReactNode }> = function ({ children }) {
  const { user, updateUser, notifications } = useContext(ContextStore)
  // console.log('component mounting: ', user)

  // const listener = () => requestPermission()
  // const eventType = 'window'
  // const event = addEventListener(eventType, listener)

  // useEffect(() => {
  //   if (navigator && Notification?.permission !== 'granted') {
  //     updateUser(JSON.parse(localStorage.getItem('site-user') || ''))
  //   }
  //   return ()=>{
  //     removeEventListener(eventType, listener)
  //   }
  // }, [])

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