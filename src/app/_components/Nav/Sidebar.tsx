'use client'
import Link from "next/link"
import { usePathname } from "next/navigation";
import { FcDataConfiguration } from 'react-icons/fc'
import { VscRunAll } from 'react-icons/vsc'
import { SlGraph } from 'react-icons/sl'
import { SignOut } from "../Auth/SignOut";

export const showOnSmall = 'sm:hidden max-sm:px-2 text-2xl'
export const hideOnSmall = 'max-sm:hidden'
export const Sidebar = () => {
  const pathName = usePathname();
  const activeTabColor = '#1e40af'
  const classes = 'h-fit px-4 py-2 cursor-pointer bg-transparent rounded-xl hover:bg-blue-600/20'
  return (
    <aside className="h-full bg-slate-900 w-fit z-[100] fixed">
      <nav className='flex flex-col h-full justify-between relative pb-2'>
        <div className="w-full">
          <Link className="w-full" href='/dashboard'>
            <h1 className={"font-bold h-[4rem] text-xl border p-4 hover:bg-slate-500/20" + ' ' + hideOnSmall}>
              Gen-Algo
            </h1>
            <h1 className={"font-bold h-[4rem] text-xl border p-4 hover:bg-slate-500/20" + ' ' + showOnSmall}>
              GA
            </h1>
          </Link>
          <hr className="my-4" />
        </div>
        <ul className="relative top-[-200px] py-4 pl-2 pr-4 max-sm:px-0 flex flex-col gap-2">
          <>
            <Link href={'/dashboard/config/all'} style={pathName?.startsWith('/dashboard/config') ? { backgroundColor: activeTabColor } : {}} className={classes + ' ' + hideOnSmall}><strong>
              Configuration
            </strong></Link>
            <Link href={'/dashboard/config/all'} style={pathName?.startsWith('/dashboard/config') ? { backgroundColor: activeTabColor } : {}} className={classes + ' ' + showOnSmall}><strong>
              <FcDataConfiguration />
            </strong></Link>
            <Link href={'/dashboard/runs/all'} style={pathName?.startsWith('/dashboard/runs') ? { backgroundColor: activeTabColor } : {}} className={classes + ' ' + hideOnSmall}><strong>
              Runs
            </strong></Link >
            <Link href={'/dashboard/runs/all'} style={pathName?.startsWith('/dashboard/runs') ? { backgroundColor: activeTabColor } : {}} className={classes + ' ' + showOnSmall}><strong>
              <VscRunAll />
            </strong></Link >
            <Link href={'/dashboard/visualisation'} style={pathName === '/dashboard/visualisation' ? { backgroundColor: activeTabColor } : {}} className={classes + ' ' + hideOnSmall}><strong>
              Visualisations
            </strong></Link >
            <Link href={'/dashboard/visualisation'} style={pathName === '/dashboard/visualisation' ? { backgroundColor: activeTabColor } : {}} className={classes + ' ' + showOnSmall}><strong>
              <SlGraph />
            </strong></Link >
          </>
        </ul>
        <SignOut />
      </nav>
    </aside>
  )
}


