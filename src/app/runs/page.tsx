import { MainContainer } from "../components/Container/MainContainer"
import { Runs } from "./Runs"

const Page = () => {


  return (
    <MainContainer>
      <section id='runs-section'>
        <h1 className='font-bold text-xl sm:text-3xl mb-4 sm:mb-8 text-center'>Algorithm Runs</h1>
        <Runs />
      </section>
    </MainContainer>
  )
}

export default Page