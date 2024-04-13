'use client'
import useBearStore from '@/app/stores/bearStore'
import { User } from '@prisma/client'
import axios, { AxiosError } from 'axios'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { IoClose } from 'react-icons/io5'
import { TiTick } from 'react-icons/ti'

export default function FriendRequestBox({
  user,
  variant,
  popFromState,
}: {
  user: User
  variant: 'incoming' | 'sent'
  popFromState: (userId: string) => void
}) {
  const { friends, setFriends } = useBearStore()
  const style = clsx(
    'w-full flex shadow-md border-maroonlight border-1 p-3 mt-1 rounded-xl hover:transition-colors',
    variant === 'incoming' && 'bg-customcoolcolor',
    variant === 'sent' && 'bg-slate-400 hover:bg-slate-500 bg-opacity-20'
  )
  const session = useSession()
  const currentUser = session.data?.user?.email

  const handleError = useCallback((err: AxiosError | Error | null) => {
    if (err && err instanceof AxiosError)
      toast.error(err.message || 'Failed to reject friend request')
    else toast.error("Couldn't handle request")
  }, [])

  const acceptIncomingRequest = useCallback(() => {
    if (currentUser)
      axios
        .post(`/api/friends/accept`, {
          receiver: currentUser,
          sender: user.email,
        })
        .then((resp) => {
          toast.success('Friend request accepted')
          popFromState(user.id)
          console.log(resp.data)
          setFriends([...(friends || []), resp.data])
        })
        .catch(handleError)
  }, [
    currentUser,
    user.email,
    handleError,
    popFromState,
    user.id,
    setFriends,
    friends,
  ])

  const rejectIncomingRequest = useCallback(() => {
    if (currentUser)
      axios
        .post(`/api/friends/reject`, {
          receiver: currentUser,
          sender: user.email,
        })
        .then((resp) => {
          toast('Friend request rejected')
          popFromState(user.id)
        })
        .catch(handleError)
  }, [currentUser, user.email, handleError, popFromState, user.id])

  const unsendOutboundRequest = useCallback(() => {
    if (currentUser)
      axios
        // .post(`/api/friends/unsend`, {
        //   receiver: user.email,
        //   sender: currentUser,
        // })
        .post(`/api/friends/reject`, {
          receiver: user.email,
          sender: currentUser,
        })
        .then((resp) => {
          toast('Unsent friend request')
          popFromState(user.id)
        })
        .catch(handleError)
  }, [currentUser, user.email, handleError, popFromState, user.id])

  return (
    <div className={style}>
      <div className="flex">
        <div className="w-max relative h-max shadow-xl rounded-full">
          <img
            src={user.image || '/gengar.jpg'}
            className="w-10 h-10 rounded-full"
          />
          <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 ring-navycustom ring-4 z-50 rounded-full" />
        </div>
      </div>

      <div className="flex ml-2 flex-row justify-start min-w-0 text-ellipsis whitespace-nowrap w-full">
        <div className="text-md text-slate-400">{user.username}</div>
        {variant === 'incoming' ? (
          <div className="ml-auto flex flex-row p-1 gap-3 ">
            <div onClick={acceptIncomingRequest}>
              <TiTick className="w-7 h-7 cursor-pointer text-black2 hover:bg-navylight rounded-lg transition-colors" />
            </div>
            <div onClick={rejectIncomingRequest}>
              <IoClose className="w-7 h-7 cursor-pointer text-black2 hover:bg-navylight rounded-lg transition-colors" />
            </div>
          </div>
        ) : (
          <div onClick={unsendOutboundRequest} className="ml-auto">
            <IoClose className="w-7 h-7 cursor-pointer text-black2 hover:bg-slate-400 rounded-lg transition-colors" />
          </div>
        )}
      </div>
    </div>
  )
}
