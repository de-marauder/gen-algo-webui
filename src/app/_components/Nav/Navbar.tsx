'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react";
import ContextStore from "../store/context";
import { SignOut } from "../Auth/SignOut";

export const Navbar = () => {
  const { user } = useContext(ContextStore);
  const pathName = usePathname();

  const activeTabColor = '#1e40af'
  const classes = 'h-fit px-4 py-2 cursor-pointer bg-transparent rounded-xl hover:bg-blue-600/20'
  return (
    <nav className='mt-8 mx-auto p-2 flex justify-between items-center'>
      <ul className='flex justify-center gap-4'>
        <Link href={'/'} style={pathName === '/' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Home</strong></Link>
      </ul>
      {!user ? (
        <ul className='flex justify-center gap-4'>
          <Link href={'/auth/login'} style={pathName === '/auth/login' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Login</strong></Link>
          <Link href={'/auth/signup'} style={pathName === '/auth/signup' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Signup</strong></Link >
        </ul>
      ) : (
        <div className='flex gap-2 items-center'>
          <Link href='/dashboard'>
            <p className="h-fit py-2 px-4 border rounded rounded-3xl cursor-pointer hover:bg-blue-800/50">{user.username}</p>
          </Link>
          <SignOut />
        </div>
      )}
    </nav>
  )
}

