import { MainContainer } from "../../../_components/Container/MainContainer"
import { SubNav } from "@/app/_components/Nav/SubNav"
import { CreateConfig } from "./CreateConfig"

{/* <Link href={'/dashboard/config'} style={pathName === '/dashboard/config' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>Create</strong></Link>
          <Link href={'/dashboard/config/all'} style={pathName === '/dashboard/config/all' ? { backgroundColor: activeTabColor } : {}} className={classes}><strong>View all</strong></Link > */}
export const nav = [
  {
    label: 'create',
    link: '/dashboard/config'
  },
  {
    label: 'view',
    link: '/dashboard/config/all'
  }
];

const Page = () => {

  return (
    <>
      <SubNav nav={nav} />
      <MainContainer >
        <CreateConfig />
      </MainContainer >
    </>
  )
}

export default Page;

