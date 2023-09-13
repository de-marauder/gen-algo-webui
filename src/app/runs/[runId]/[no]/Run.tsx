'use client'

import { Modal } from '@/app/components/Modals/Modal';
import { Blur } from '@/app/components/utils/Blur';
import Loading from '@/app/loading';
import { AlgoResult } from '@/lib/prisma/algoRuns';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export const Run: React.FC<{ runId: string, no: string }> = ({ runId, no }) => {
  const [run, setRun] = useState<AlgoResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        setError('')
        setLoading(true)
        const { data } = await axios.get<{ run: AlgoResult | null; error: Error | null }>(`/api/runs/${runId}`)
        console.log('run: ', data);
        if (data.error) throw new Error(data.error.message)
        setLoading(false)
        setRun(data.run)
      } catch (error) {
        setLoading(false)
        console.log()
        setError((error as Error).message)
      }
    })();
  }, [runId]);

  return (
    <section id='run-section'>
      {error && <Modal isError toggle={() => { setError('') }} message={error} />}
      <div className='sm:p-4'>
        <h1 className='font-bold text-xl sm:text-3xl border-b border-blue-800/50 pb-4 mb-4'>
          Run {no}
        </h1>
        {loading && <Loading />}
        <Blur />
        <div className='grid grid-cols-2 gap-4 bg-blue-800/10 backdrop-blur-sm border border-blue-800/20 rounded-3xl p-4'>
          {run && Object.entries(run).map((el, id) => {
            return (
              <div key={`run-item-${id}`} className='flex flex-col gap-2 p-2 border border-blue-800/10'>
                <p><strong>{el[0]}</strong></p>
                <p><em>{el[1]}</em></p>
                <Blur />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}