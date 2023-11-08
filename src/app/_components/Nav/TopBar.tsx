'use client'
import Link from "next/link"
import { useContext, useState } from "react";
import ContextStore from "../store/context";
import { usePathname } from "next/navigation";
import { BsBell } from 'react-icons/bs'
import { Toggle } from "../utils/Toggle";
import { APIConfig } from "@/app/(Dashboard)/dashboard/config/_helper";
import axios from "axios";
import { Modal } from "../Modals/Modal";
import { SubscribeNotification } from "../Notifications/Notifications";


export const TopBar = () => {
  const { user } = useContext(ContextStore);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const pathName = usePathname();
  const activeTabColor = 'blue'
  const classes = 'h-fit px-4 py-2 cursor-pointer bg-transparent rounded-xl hover:bg-blue-600/20'

  const UserOptions = () => (
    <>
      <aside className="rounded bg-slate-100 border border-blue-800 shadow-inner absolute top-[120%] right-0 min-w-[150px]">
        <SubscribeNotification />
      </aside>
    </>
  )

  return (
    <>
      <div className="border h-[4rem] text-xl fixed w-[100vw] z-[10] bg-slate-900">
        <nav className='h-full text-sm rounded mx-auto py-2 px-2 flex justify-end items-center'>
          {!user ? (
            <ul className='flex justify-center gap-4'>
              <Link href={'/auth/login'} style={pathName === '/auth/login' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Login</strong></Link>
              <Link href={'/auth/signup'} style={pathName === '/auth/signup' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Signup</strong></Link >
            </ul>
          ) : (
            <div className='flex gap-4 items-center'>
              <NotifBell />
              <div className="relative" >
                <p
                  onClick={() => setShowUserOptions(!showUserOptions)}
                  className="cursor-default hover:bg-blue-500/20 h-fit py-2 px-4 border rounded rounded-3xl">{user.username}</p>
                {showUserOptions && <UserOptions />}
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  )
};

const NotifBell = () => {
  const { notifications, updateNotification, notifCounter } = useContext(ContextStore);

  return (
    <div className="hover:bg-blue-500/20 rounded-3xl p-2 relative" onClick={() => updateNotification(!notifications)}>
      <BsBell className='text-2xl font-bold' />
      {notifCounter > 0 ?
        <p className='text-sm absolute top-[-10px] right-[-10px] px-2 rounded-xl bg-slate-200/50'>
          {notifCounter < 100 ? notifCounter : '100+'}
        </p>
        : null
      }
    </div>
  )
}