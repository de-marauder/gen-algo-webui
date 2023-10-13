import { SubNav } from "@/app/_components/Nav/SubNav"
import { MainContainer } from "../../../_components/Container/MainContainer"
import { CreateRun } from "./CreateRun"


export const runNav = [
  {
    label: 'create',
    link: '/dashboard/runs'
  },
  {
    label: 'view',
    link: '/dashboard/runs/all'
  }
]

const Page = () => {
  return (
    <>
      <SubNav nav={runNav} />
      <MainContainer>
        <section id='runs-section'>
          <h1 className='font-bold text-xl sm:text-3xl mt-4 mb-4 sm:mb-8 text-center'>Create Algorithm Runs</h1>
          <CreateRun />
        </section>
      </MainContainer>
    </>
  )
}

export default Page