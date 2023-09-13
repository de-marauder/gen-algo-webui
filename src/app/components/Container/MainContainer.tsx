import { ReactNode } from "react"

export const MainContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <div className='container mx-auto sm:p-16 w-full mt-16 bg-white/5 rounded-xl border-t border-blue-500/25 shadow-lg shadow-blue-500/25'>
        {children}
      </div>
    </div>
  )
}