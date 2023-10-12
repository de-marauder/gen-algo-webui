'use client'
import React from "react"
import { Modal } from "../_components/Modals/Modal"

const ErrorPage: React.FC<{ error: any; reset: any }> = ({ error, reset }) => {
  // console.log(error, reset)
  return (
    <>
      {error && <Modal toggle={() => { error = !error }} isError={true} message="Something bad happended"></Modal>}
    </>
  )
}
export default ErrorPage;