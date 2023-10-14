'use client'
import { HeroWrapper } from "../../_components/Hero/Hero"
import { DashBoardData } from "./dashboard"

const Page = () => {
  // console.log('page rendering...')
  return (
    <div className='flex flex-wrap pb-8'>
      <HeroWrapper>
        <DashBoardData />
      </HeroWrapper>
    </div>
  )
}

export default Page
