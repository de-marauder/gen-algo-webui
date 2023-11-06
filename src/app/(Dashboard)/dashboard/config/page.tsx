import { MainContainer } from "../../../_components/Container/MainContainer"
import { SubNav } from "@/app/_components/Nav/SubNav"
import { CreateConfig } from "./CreateConfig"

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

