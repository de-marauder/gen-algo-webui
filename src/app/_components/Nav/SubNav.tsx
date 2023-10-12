'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SubNav = ({ nav }: {
  nav: {
    link: string;
    label: string;
  }[]
}) => {
  const pathName = usePathname();

  const activeTabColor = 'green'
  const classes = 'border border-green-800 h-fit px-4 py-2 cursor-pointer bg-transparent rounded-xl hover:bg-green-600/20'
  return (
    <nav className='bg-blue-800/10 rounded rounded-2xl mt-4 mb-4 mx-auto p-2 flex justify-center items-center'>
      <ul className='flex justify-center gap-4'>
        <>
          {
            nav.map((el, id) => {
              return (
                <Link key={el.label + '-link'} href={el.link} style={pathName === el.link ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>{el.label}</strong></Link>
              )
            })
          }
        </>
      </ul>
    </nav>
  )
}