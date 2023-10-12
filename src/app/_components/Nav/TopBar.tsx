'use client'
import Link from "next/link"
import { useContext } from "react";
import ContextStore from "../store/context";
import { usePathname } from "next/navigation";


export const TopBar = () => {
  const { user } = useContext(ContextStore);
  const pathName = usePathname();
  const activeTabColor = 'blue'
  const classes = 'h-fit px-4 py-2 cursor-pointer bg-transparent rounded-xl hover:bg-blue-600/20'
  return (
    <div className="border h-[4rem] text-xl fixed w-[100vw] z-[10] bg-slate-900">
      <nav className='h-full text-sm rounded mx-auto py-2 px-2 flex justify-end items-center'>
        {!user ? (
          <ul className='flex justify-center gap-4'>
            <Link href={'/auth/login'} style={pathName === '/auth/login' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Login</strong></Link>
            <Link href={'/auth/signup'} style={pathName === '/auth/signup' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Signup</strong></Link >
          </ul>
        ) : (
          <div className='flex gap-2 items-center'>
            <p className="cursor-default hover:bg-blue-500/20 h-fit py-2 px-4 border rounded rounded-3xl">{user.username}</p>
          </div>
        )}
      </nav>
    </div>
  )
};