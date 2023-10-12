import { MainContainer } from "@/app/_components/Container/MainContainer"
import { ViewAll } from "./ViewAll"
import { SubNav } from "@/app/_components/Nav/SubNav"
import { nav } from "../page"

const Page = () => {
  return (
    <>
      <SubNav nav={nav} />
      <MainContainer>
        <ViewAll />
      </MainContainer>
    </>

  )
}

export default Page
