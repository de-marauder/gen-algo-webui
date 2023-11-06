export const Toggle = ({ isActive, setState, action }: { isActive: boolean, setState: () => void; action: () => Promise<void> }) => {
  const outerToggleStyle = { backgroundColor: '' };
  const innerToggleStyle = { left: '' };
  if (isActive === true) {
    outerToggleStyle.backgroundColor = 'blue'
    innerToggleStyle.left = 'calc(1rem - 2px)'
  }
  return (
    <div
      onClick={() => {
        action();
        // setState();
      }}
      style={outerToggleStyle} className="relative rounded-3xl p-[2px] h-[1.2rem] w-[2rem] shadow-inner bg-slate-500">
      <div style={innerToggleStyle} className="absolute left-[2px] rounded-3xl w-[1rem] h-[1rem] bg-slate-100 shadow"></div>
    </div>
  )
}