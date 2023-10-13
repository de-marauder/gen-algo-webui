import { SubNav } from "@/app/_components/Nav/SubNav"
import { MainContainer } from "../../../../_components/Container/MainContainer"
import { runNav } from "../page"
import { ViewAllRuns } from "./ViewAllRuns"


const Page = () => {
  return (
    <>
      <SubNav nav={runNav} />
      <MainContainer>
        <section id='create-runs-section'>
          <h1 className='font-bold text-xl sm:text-3xl my-4 sm:mb-8 sm:text-center'>Algorithm Runs</h1>
          <ViewAllRuns />
        </section>
      </MainContainer>
    </>
  )
}

export default Page