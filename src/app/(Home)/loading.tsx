import './loading.css'

export const Loading = ({ type }: { type?: string }) => {
  

  return (
    <div className='mx-auto p-8'>
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
  )
}
export default Loading