import { HeroWrapper } from "../../_components/Hero/Hero"
import { DashBoardData } from "./dashboard"

const Page = () => {

  return (
    <div className='flex flex-wrap pb-8'>
      <HeroWrapper>
        <DashBoardData />
      </HeroWrapper>
    </div>
  )
}

export default Page
