'use client'

import { useEffect, useState } from "react"
import { ConfigForm } from "../../../_components/Forms/config"
import { Modal } from "../../../_components/Modals/Modal"
import Loading from "../../../(Home)/loading"
import { TypeConfig } from "@/Types/Config"
import { Blur } from "@/app/_components/utils/Blur"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/app/_components/Buttons/Buttons"
import axios, { AxiosError } from "axios"
import { APIConfig } from "./_helper"
import { useRouter } from "next/navigation"

export const CreateConfig = () => {
  const [config, setConfig] = useState<null | TypeConfig>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');

  return (
    <>
      {error && <Modal toggle={() => { setError('') }} isError={true} message={error} />}
      {loading && <Modal noCloseButton={true} toggle={() => { setLoading(false) }}><Loading /></Modal>}
      <section id='config-section text-white' className="max-sm:p-2 max-sm:pb-[5rem] overflow-y-scroll h-[100vh]">
        <ConfigForm
          setConfig={setConfig}
          setLoading={setLoading}
          setError={setError}
        />
      </section >
    </>
  )
}

export const ConfigCard = ({ config }: { config: Omit<TypeConfig, 'userid'> }) => {
  const router = useRouter()
  const pathname = usePathname();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')

  const viewAllStylesForSection = pathname === '/dashboard/config/all' ? ' h-[400px] overflow-hidden mb-8' : 'p-2';
  const viewAllStyles = pathname === '/dashboard/config/all' ? ' h-[300px] overflow-y-scroll' : '';
  const [configId] = useState(config._id);

  const deleteConfig = (configId: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/configs/${configId}`;
    setError('');
    setLoading(true);
    axios.delete(url, APIConfig)
      .then((response) => {
        setLoading(false);
        setShowDeleteModal(false)
        router.push('/dashboard/config/all')
      }).catch((error) => {
        setLoading(false);
        if (error instanceof AxiosError) setError(error.response?.data.message || 'Error making delete request')
        setError(error.message || 'request failed')
      })
  }
  delete (config as Partial<TypeConfig>).userid;
  delete (config as { createdAt?: string }).createdAt;
  delete (config as { updatedAt?: string }).updatedAt;
  delete (config as { __v?: string }).__v;
  delete (config as { _id?: string })._id;

  return (
    <>
      {showDeleteModal && (
        <Modal toggle={() => { }} noCloseButton>
          <div className="grid gap-4">
            <h3>Are you sure you want to delete this config?</h3>
            <div className="flex gap-4 justify-between">
              <Button type='sm' styles="bg-slate-300 text-black hover:text-white px-4" onClick={() => { deleteConfig(configId) }}>Yes</Button>
              <Button type="sm" styles='bg-red-500 hover:bg-red-800/50' onClick={() => { setShowDeleteModal(false) }}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
      {loading && (
        <Modal toggle={() => { }} noCloseButton>
          <Loading />
        </Modal>
      )}
      {error && (
        <Modal message={error} isError toggle={() => { setError('') }} />
      )}
      <section id='single-config-section' className={viewAllStylesForSection}>
        <div className='sm:p-4 h-full'>
          <div className='flex justify-between items-center mr-2'>
            <h1 className='font-bold text-sm sm:text-3xl border-b border-blue-800/50 pb-4 mb-4'>
              {config.name}
            </h1>
            <div className="flex max-sm:flex-col-reverse max-sm:gap-2 max-sm:items-end gap-4">
              {(pathname === '/dashboard/config/all') && (
                <Link href={`/dashboard/config/${configId}`} className="font-bold p-2 max-sm:px-4 my-2 mx-auto rounded ring-2 ring-offset-2 active:scale-[97%] bg-blue-800  hover:bg-white hover:text-blue-800">
                  Goto
                </Link>
              )}
              <Button styles="bg-red-500 hover:bg-red-800/50" type="sm" onClick={() => { setShowDeleteModal(true) }}>Delete</Button>
            </div>
          </div>
          <Blur />
          <div className={'grid sm:grid-cols-2 gap-4 bg-blue-800/10 backdrop-blur-sm border border-blue-800/20 rounded-3xl p-4 ' + viewAllStyles} >
            {config && Object.entries(config).map((el, id) => {
              return (
                <div key={`config-item-${id}`} className='flex flex-col gap-2 p-2 border border-blue-800/10 h-[4.5rem] overflow-hidden'>
                  <p><strong>{el[0]}</strong></p>
                  <p><em>{el[1]}</em></p>
                  <Blur />
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </>
  )
}