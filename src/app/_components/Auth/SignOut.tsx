'use client'
import { CiLogout } from "react-icons/ci";
import { Button } from "../Buttons/Buttons";
import { hideOnSmall, showOnSmall } from "../Nav/Sidebar";
import { Modal } from "../Modals/Modal";
import axios, { AxiosError } from "axios";
import { useContext, useState } from "react";
import ContextStore from "../store/context";
import { useRouter } from "next/navigation";
import { TypeUser } from "@/Types/User";
import { APIConfig } from "@/app/(Dashboard)/dashboard/config/_helper";
import { cookie } from "@/app/(Home)/auth/helpers";

export const SignOut = () => {
  const router = useRouter()
  const { updateUser } = useContext(ContextStore)
  const [responseError, setResponseError] = useState<string>('');
  const logout = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/signout`

    // // console.log(cookie)
    // const response = 
    window.localStorage.removeItem('site-user');
    cookie.remove('jwt-token');
    axios.delete<{ data: TypeUser }>(url, APIConfig)
      .then((response) => {
        // console.log(response)
        updateUser(null)
        router.push('/')
      }).catch((error) => {
        // console.log(error)
        if (error instanceof AxiosError) setResponseError(error.response?.data.message || 'Error signing out user.')
        else setResponseError((error as Error).message)
      });
  }
  return (
    <>
      {responseError && <Modal isError={true} message={responseError} toggle={() => setResponseError('')} />}
      <Button styles={"bg-red-500 hover:bg-red-800/50" + ' ' + hideOnSmall} onClick={logout} type="sm">
        Log out
      </Button>
      <Button styles={"bg-red-500 hover:bg-red-800/50" + ' ' + showOnSmall} onClick={logout} type="sm">
        <CiLogout />
      </Button>
    </>
  )
}