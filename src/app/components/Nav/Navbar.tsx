'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Navbar = () => {
  const pathName = usePathname();
  const activeTabColor = 'blue'
  const classes = 'px-4 py-2 cursor-pointer bg-transparent rounded-xl hover:bg-blue-600/20'
  return (
    <nav className='mt-8 mx-auto p-2'>
      <ul className='flex justify-center gap-4'>
        <Link href={'/'} style={pathName === '/' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Home</strong></Link>
        <Link href={'/config'} style={pathName === '/config' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Configuration</strong></Link>
        <Link href={'/runs'} style={pathName === '/runs' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Runs</strong></Link >
        <Link href={'/visualisation'} style={pathName === '/visualisation' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Visualisations</strong></Link >
      </ul>
    </nav>
  )
}

