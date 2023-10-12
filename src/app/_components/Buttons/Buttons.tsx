import { ReactNode } from "react"

export const Button: React.FC<{ styles?: string; children: ReactNode, type: 'sm' | 'lg', onClick?: () => void }> = ({ styles, children, type, onClick }) => {
  return (
    <button onClick={onClick} className={
      (type === 'sm' ?
        "p-2 "
        : type === 'lg' ?
          "px-4 py-2"
          : '') + ' my-2 mx-auto rounded ring-2 ring-offset-2 active:scale-[97%] hover:bg-blue-800/50 bg-blue-800 ' + styles
    }>
      {children}
    </button>
  )
}