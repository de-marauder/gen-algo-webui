import './loading.css'

export const Loading = () => {
  return (
    <div className='mx-auto p-8'>
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
  )
}
export default Loading