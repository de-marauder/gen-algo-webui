'use client'
import { HeroWrapper } from "@/app/_components/Hero/Hero"
import { TypeUser } from "@/Types/User"
import { FormEvent, useState, useContext } from "react"
import { Input, Form, errorPresent, redirectRoute } from "../helpers"
import axios, { AxiosError } from "axios"
import { Modal } from "@/app/_components/Modals/Modal"
import { useRouter } from "next/navigation"
import ContextStore from "@/app/_components/store/context"
import { cookie } from "../helpers"
import Loading from "../../loading"

type LoginDetails = Omit<TypeUser, '_id'>

const Page = () => {
  const router = useRouter()
  const { user } = useContext(ContextStore)
  if (user) router.push(redirectRoute)

  const [loginDetails, setLoginDetails] = useState<LoginDetails>(
    { username: '', email: '', password: '' }
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [responseError, setResponseError] = useState<string>('');
  const [error, setError] = useState<LoginDetails>(
    { username: '', email: '', password: '' }
  )
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // console.log(loginDetails)
    // send data
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`
    const payload = { ...loginDetails };
    const config = {
      headers: {
        'content-type': 'application/json'
      }
    }
    setLoading(true)
    axios.post<{ data: TypeUser }>(url, payload, config)
      .then((response) => {
        // console.log(response)
        setLoading(false)
        const user = response.data.data;
        cookie.set('jwt-token', user.token)
        // console.log(cookie)
        delete user.token
        window.localStorage.setItem('site-user', JSON.stringify(user || {}));
        router.push(redirectRoute)
      }).catch((error) => {
        // console.log(error)
        setLoading(false)
        if (error instanceof AxiosError) setResponseError(error.response?.data.message || 'Error logging in user.')
        else setResponseError((error as Error).message)
      });
  }
  return (
    <>
      {loading && <Modal noCloseButton toggle={() => { }} ><Loading /></Modal>}
      {responseError && <Modal isError={true} message={responseError} toggle={() => setResponseError('')} />}
      <HeroWrapper>
        <div>
          <Form handleSubmit={handleSubmit} title="Login" hideSubmit={() => errorPresent(error)}>
            {Object.entries(loginDetails).map(([key, val], id) => {
              return <Input<LoginDetails>
                key={key + '-' + id}
                label={key} value={val}
                onChange={setLoginDetails}
                error={error[key as keyof typeof error]}
                setError={setError} />
            })}
          </Form>
        </div>
      </HeroWrapper>
    </>
  )
}

export default Page
