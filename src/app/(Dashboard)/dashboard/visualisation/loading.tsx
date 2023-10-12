import './loading.css'

const Loading = () => {
  return (
    <div className='flex justify-between items-center p-8 w-fit'>
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
  )
}
export default Loading