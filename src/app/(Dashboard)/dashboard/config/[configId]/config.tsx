'use client'
import axios, { AxiosError } from "axios";
import { ConfigCard } from "../CreateConfig";
import { useEffect, useState } from "react";
import { TypeConfig } from "@/Types/Config";
import { Modal } from "@/app/_components/Modals/Modal";
import { APIConfig } from "../_helper";

export const Config = ({ configId }: { configId: string }) => {
  const [config, setConfig] = useState<TypeConfig | null>(null);
  const [error, setError] = useState('')

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/configs/${configId}`;

    axios.get<{ status: string; data: TypeConfig }>(url, APIConfig)
      .then((response) => {
        // console.log(response);
        setConfig(response.data.data)
      }).catch((error) => {
        // console.log(error)
        if (error instanceof AxiosError) setError(error.response?.data.message || 'Request failed')
      })
  }, [configId])
  return (
    <>
      {error && <Modal toggle={() => { setError('') }} isError={true} message={error} />}
      {
        config ?
          <ConfigCard config={config} /> :
          <p>No Config!</p>
      }
    </ >
  )
}
