import { ReactNode } from "react"

export const Hero = ({ children }: { children: ReactNode }) => {
  return (
    <HeroWrapper>
      <h1 className="text-center text:lg sm:text-[4rem] md:text-[6rem] font-bold text-shadow-white">
        {children}
      </h1>

    </HeroWrapper>
  )
}

export const HeroWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {

  return (
    <section id='home-section' className='container mx-auto mt-[4rem] py-[4rem] text-white min-h-[40vh] sm:min-h-[70vh] grid place-items-center border border-blue-800 rounded-3xl bg-blue-800/10 backdrop-blur-sm'>
      {children}
    </section>
  )
}