'use client'
import { FormEvent, useContext, useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { HeroWrapper } from "@/app/_components/Hero/Hero"
import { TypeUser } from "@/Types/User"
import { Form, Input, cookie, errorPresent, redirectRoute, toTitleCase } from "../helpers"
import axios, { AxiosError } from "axios"
import { Modal } from "@/app/_components/Modals/Modal"
import ContextStore from "@/app/_components/store/context"


type SignUpDetails = Omit<TypeUser, '_id'>
  & { confirmPassword: string }

const Page = () => {
  const router = useRouter();
  const { user } = useContext(ContextStore)
  if (user) router.push(redirectRoute)

  const [signUpDetails, setSignUpDetails] = useState<SignUpDetails>({
    username: '', email: '', password: '', confirmPassword: ''
  })
  const [responseError, setResponseError] = useState<string>('');
  const [error, setError] = useState<SignUpDetails>({
    username: '', email: '', password: '', confirmPassword: ''
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // console.log(signUpDetails)
    if (signUpDetails.password !== signUpDetails.confirmPassword) {
      setError((prevError) => {
        return {
          ...prevError,
          confirmPassword: 'does not match password'
        }
      })
      return
    }

    // send data
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`
    const payload = { ...signUpDetails };
    const config = {
      headers: {
        'content-type': 'application/json'
      }
    }

    axios.post<{ data: TypeUser }>(url, payload, config)
      .then((response) => {
        // console.log(response)
        const user = response.data.data;
        cookie.set('jwt-token', user.token)
        delete user.token
        window.localStorage.setItem('site-user', JSON.stringify(user || {}))
        router.push(redirectRoute)
      }).catch((error) => {
        // console.log(error)
        if (error instanceof AxiosError) setResponseError(error.response?.data.message || 'Error creating user.')
        else setResponseError((error as Error).message)
      });
  }

  return (
    <HeroWrapper>
      {responseError && <Modal isError={true} message={responseError} toggle={() => setResponseError('')} />}
      <div>
        <Form handleSubmit={handleSubmit} title="Sign Up" hideSubmit={() => errorPresent(error)}>
          {Object.entries(signUpDetails).map(([key, val], id) => {
            return <Input<SignUpDetails>
              key={key + '-' + id}
              label={key} value={val}
              onChange={setSignUpDetails}
              error={error[key as keyof typeof error]}
              setError={setError} />
          })}
        </Form>
      </div>
    </HeroWrapper>
  )
}


export default Page;
