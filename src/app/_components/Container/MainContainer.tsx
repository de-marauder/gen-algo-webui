import { ReactNode } from "react"

export const MainContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="h-full pb-[10rem]">
      <div className='container mx-auto mb-16 sm:p-16 w-full mt-4 bg-white/5 rounded-xl border-t border-blue-500/25 shadow-lg shadow-blue-500/25'>
        {children}
      </div>
    </div>
  )
}