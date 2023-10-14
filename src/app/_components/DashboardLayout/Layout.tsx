'use client'
import { useContext } from 'react';
import ContextStore from '@/app/_components/store/context'
import Loading from '@/app/(Home)/loading'
import { Sidebar } from '../../_components/Nav/Sidebar'
import { TopBar } from '../../_components/Nav/TopBar'
import { Blur } from '../../_components/utils/Blur'

export const Component: React.FC<{ children: React.ReactNode }> = function ({ children }) {
  const { user } = useContext(ContextStore)
  // console.log('component mounting: ', user)
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
          </main>
        </> : <Loading />
      }
    </>
  )
}