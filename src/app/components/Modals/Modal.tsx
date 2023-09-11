import { ReactNode } from "react";
import { Button } from "../Buttons/Buttons";

export const Modal: React.FC<{ children?: ReactNode, message?: string, noCloseButton?: boolean; toggle: () => void, isError?: boolean }> = ({ children, noCloseButton, message, toggle, isError }) => {
  return (
    <Backdrop>
      <div onClick={(e => { e.stopPropagation() })} className="min-w-[300px] grid place-items-center max-w-[400px] min-h-[200px] bg-black/95 text-white shadow-3xl p-4 mx-auto rounded-xl">
        <p style={isError ? { color: 'red' } : {}}>{message}</p>
        {children}
        {!noCloseButton && <Button onClick={toggle} type="sm">Close</Button>}
      </div>
    </Backdrop>
  )
}

const Backdrop: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="grid place-items-center bg-gray-900/20 backdrop-blur-sm fixed top-0 left-0 bottom-0 right-0 z-10" >
      {children}
    </div>
  )
}