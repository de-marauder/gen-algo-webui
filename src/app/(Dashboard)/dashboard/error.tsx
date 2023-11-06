'use client'
import { Modal } from "@/app/_components/Modals/Modal";
import React from "react"

const ErrorPage: React.FC<{ error: any; reset: any }> = ({ error, reset }) => {
  // console.log(error, reset)
  return (
    <>
      {error && <Modal toggle={() => { reset()}} isError={true} message="Something bad happended"></Modal>}
    </>
  )
}
export default ErrorPage;