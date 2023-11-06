'use client'
import { ImBin } from 'react-icons/im'
import { AiOutlineClose } from 'react-icons/ai'
import { NotesType } from "@/Types/Note"
import { APIConfig } from "@/app/(Dashboard)/dashboard/config/_helper"
import Loading from "@/app/(Home)/loading"
import axios from "axios"
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { Modal } from '../Modals/Modal'
import ContextStore from '../store/context'
import { Toggle } from '../utils/Toggle'
import { doNotification } from '@/services/notificationSetup'
import { Button } from '../Buttons/Buttons'
import Link from 'next/link'



export const Notifications = () => {
  const [notes, setNotes] = useState<NotesType[]>([]);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState('');
  const { notifications, updateNotification } = useContext(ContextStore)
  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/notifications`;
    axios.get(url, APIConfig)
      .then((response: { data: { data: NotesType[] } }) => {
        setloading(false)
        // console.log(response)
        setNotes(response.data.data)
      }).catch((error) => {
        setloading(false)
        // console.log(error)
        setError(error.message)
      })
  }, [])
  return (
    <>
      {
        notifications ?
          <aside className="max-sm:w-full max-sm:right-0 w-[500px] p-4 bg-slate-800 absolute right-[1rem] bottom-0  z-[1000] rounded-xl overflow-hidden border border-blue-800 shadow-xl shadow-blue-800/20">
            <div id='notification-header' className="pb-4 flex justify-between items-center">
              <h1 className="text-2xl w-full sm:w-[300px]">Notifications</h1>
              <div id='close-notification' className='hover:bg-slate-100 hover:text-blue-800 p-2 rounded-3xl' onClick={() => updateNotification(false)}>
                <AiOutlineClose className='text-2xl' />
              </div>
            </div>
            <hr className='border border-slate-100 w-full block' />
            <div className='py-4 min-h-[150px] max-h-[60vh] overflow-y-scroll'>
              {loading ?
                <Loading />
                : error ?
                  <p className="text-red-500">{error}</p> :
                  notes.length === 0 ?
                    <div className='h-full flex items-center text-slate-200'>
                      <p>No Notifications</p>
                    </div>
                    : (
                      notes.map((note, id) => {
                        return <Notification key={id} _id={note._id} link={note.link || ''} date={note.createdAt} message={note.message} notes={notes} setNotes={setNotes} />
                      })
                    )}
            </div>
          </aside>
          : null
      }
    </>
  )
}

const Notification = ({ _id, link, date, message, notes, setNotes }: {
  _id: string; link: string; message: string; date: string, notes: NotesType[], setNotes: Dispatch<SetStateAction<NotesType[]>>
}) => {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState('')

  const deleteNote = async (noteId: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/notifications/${noteId}`;
    axios.delete(url, APIConfig)
      .then((response: { data: NotesType[] }) => {
        setloading(false)
        // console.log(response)
        const n = notes.filter((note) => note._id !== _id)
        setNotes(n)
      }).catch((error) => {
        setloading(false)
        // console.log(error)
        setError(error.message)
      })
  }
  const splitLink = link.split('/').slice(4);
  const url = splitLink.join('/');
  return (
    <>
      {error && <Modal isError message={error} toggle={() => setError('')} />}
      <div className="p-4 relative rounded mb-2 bg-blue-800 hover:bg-blue-800/80">
        <span className="absolute right-[20px] top-[20px] text-xs">{date.replace('T', ' ').replace('Z', '').split('.')[0]}</span>
        <div className='rounded py-2 px-4'>
          {loading ?
            <Loading />
            : (
              <div className='bg-red-500/50 hover:bg-red-500 rounded-3xl p-2 w-fit' onClick={(e) => { deleteNote(_id) }}>
                <ImBin />
              </div>
            )
          }
        </div>
        <p className="text-sm sm:text-lg font-bold">{message}</p>
        {link && (
          <Link href={url}>
            <Button styles='hover:bg-white hover:text-blue-800' type='sm' onClick={() => { }}>View</Button>
          </Link>
        )
        }
      </div>
    </>
  )
}

export const SubscribeNotification = () => {
  const fcmToken = localStorage.getItem('fcmToken') || ''
  const { user, updateUser } = useContext(ContextStore)
  const [isSubscribed, setIsSubscribed] = useState(!!user?.fcmToken);
  const [error, setError] = useState('')

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('site-user') || '')
    setIsSubscribed(!!u?.fcmToken);
  }, []);

  const subscribeAction = async () => {
    // const u = JSON.parse(localStorage.getItem('site-user') || '')
    // updateUser(u)
    if (user) {
      doNotification().then(async () => {

        const url = isSubscribed ?
          `${process.env.NEXT_PUBLIC_API_URL}/notifications/unsubscribe`
          : `${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe`;

        const payload: { fcmToken?: string } = {}
        if (!isSubscribed) {
          if (!fcmToken) {
            setError('No notification token present')
            return { error: true }
          }
          payload.fcmToken = fcmToken;
        }

        await axios.patch(url, payload, APIConfig)
          .then((response) => {
            if (isSubscribed) {
              user.fcmToken = '';
            } else {
              user.fcmToken = fcmToken;
            }
            localStorage.setItem('site-user', JSON.stringify(user))
            updateUser(user)
            setIsSubscribed(!isSubscribed)
          }).catch((error) => {
            setError(error.message)
          })
      }).catch((error) => {
        setError(error.message)
      })
    }
  }
  return (
    <>
      {error && (
        <Modal isError message={error} toggle={() => setError('')} />
      )}
      <div className="p-2 flex gap-4 justify-between items-center">
        <p className="text-sm text-slate-800">Notifications</p>
        <Toggle isActive={isSubscribed} setState={() => setIsSubscribed(!isSubscribed)} action={subscribeAction} />
      </div>
    </>
  )
}