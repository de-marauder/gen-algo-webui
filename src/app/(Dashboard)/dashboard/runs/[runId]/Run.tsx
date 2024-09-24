'use client'

import { Modal } from '@/app/_components/Modals/Modal';
import { Blur } from '@/app/_components/utils/Blur';
import Loading from '@/app/(Home)/loading';
import { TypeRun } from '@/Types/Run';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { APIConfig } from '../../config/_helper';
import { toTitleCase } from '@/app/(Home)/auth/helpers';
import { Button } from '@/app/_components/Buttons/Buttons';
import { useRouter } from 'next/navigation';
import { Generations } from '../../visualisation/_helpers';

export const Run: React.FC<{ runId: string }> = ({ runId }) => {
  const [run, setRun] = useState<TypeRun | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  ///
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter()

  const deleteConfig = (id: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/runs/${id}`;

    setError('');
    setDeleteLoader(true);
    axios.delete(url, APIConfig)
      .then((response) => {
        setDeleteLoader(false);
        setShowDeleteModal(false)
        router.push('/dashboard/runs/all')
      }).catch((error) => {
        setDeleteLoader(false);
        if (error instanceof AxiosError) setError(error.response?.data.message || 'Error making delete request')
        setError(error.response?.data.message || error.message || 'request failed')
      })
  }
  ///

  useEffect(() => {
    (async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/runs/${runId}`
        setError('')
        setLoading(true)
        const { data } = await axios.get<{
          data: TypeRun | null; error: Error | null
        }>(url, APIConfig)
        // console.log('run: ', data);
        if (data.error) throw new Error(data.error.message)
        setLoading(false)
        setRun(data.data)
      } catch (error) {
        setLoading(false)
        // console.log(error)
        if (error instanceof AxiosError) setError(error.response?.data.message)
        else setError((error as Error).message)
      }
    })();
  }, [runId]);
  delete (run as { _id?: string })?._id
  delete (run as { userid?: string })?.userid
  delete (run as { updatedAt?: string })?.updatedAt
  delete (run as { createdAt?: string })?.createdAt
  delete (run as { __v?: string })?.__v
  delete (run as { generations?: Generations['generations'] })?.generations

  const url = `/dashboard/config/${(run?.config as unknown as { _id: string })?._id.toString()}`;

  return (
    <section id='run-section' className='max-sm:p-2'>
      {showDeleteModal && (
        <Modal toggle={() => { }} noCloseButton>
          <div className="grid gap-4">
            <h3>Are you sure you want to delete this run?</h3>
            <div className="flex gap-4 justify-between">
              <Button type='sm' styles="bg-slate-300 text-black hover:text-white px-4" onClick={() => { deleteConfig(runId) }}>Yes</Button>
              <Button type="sm" styles='bg-red-500 hover:bg-red-800/50' onClick={() => { setShowDeleteModal(false) }}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
      {deleteLoader && (
        <Modal toggle={() => { }} noCloseButton >
          <Loading />
        </Modal>
      )}
      {error && <Modal isError toggle={() => { setError('') }} message={error} />}
      <div className='sm:p-4'>
        <div className='flex justify-between items-center'>
          {run &&
            <>
              <h1 className='font-bold text-xl sm:text-3xl border-b border-blue-800/50 pb-4 mb-4'>
                Run {run.no}
              </h1>
              <div className='flex max-sm:flex-col-reverse max-sm:gap-2 max-sm:items-end justify-between items-center gap-4'>
                <Link
                  className='font-bold p-2 my-2 rounded ring-2 ring-offset-2 active:scale-[97%] bg-blue-800  hover:bg-white hover:text-blue-800'
                  href={url}>
                  View config
                </Link>
                <Button styles="bg-red-500 hover:bg-red-800/50 max-sm:mx-0" type="sm" onClick={() => { setShowDeleteModal(true) }}>Delete</Button>
              </div>
            </>
          }
        </div>
        <Blur />
        <div className='grid sm:grid-cols-2 gap-4 bg-blue-800/10 backdrop-blur-sm border border-blue-800/20 rounded-3xl p-4'>
          {loading && <Loading />}
          {run && Object.entries(run as Omit<TypeRun, 'generations'>).map((el, id) => {
            return (
              <>
                {
                  (el[0] !== 'config') ?
                    <div key={`run-item-${id}`} className='flex flex-col h-[5rem] overflow-hidden gap-2 p-2 border border-blue-800/10'>
                      <p><strong>{el[0].toLowerCase().startsWith('output') ? el[0].replace('put', 'put ') : toTitleCase(el[0])}</strong></p>
                      <p><em>{el[1]}</em></p>
                      <Blur />
                    </div >
                    : null
                }
              </>
            )
          })}
        </div>
      </div>
    </section >
  )
}