import { FullMessageType } from '@/app/types'
import { Message } from '@prisma/client'
import clsx from 'clsx'
import { useState } from 'react'
import ImageModal from './ImageModal'
import { Skeleton } from '@/components/ui/skeleton'

const LoadingSkeletal = (message: FullMessageType) => {
  const condition = Math.random() > 0.5

  const randomLength = Math.max(Math.floor(Math.random() * 200), 50).toString()
  console.log(randomLength)
  const style = clsx(
    `
    flex
    flex-col
    py-2
    px-4
    rounded-2xl
    shadow-lg
    ring-1
    ring-slate-200
    bg-slate-300
  `,
    condition ? 'ml-auto' : 'mr-auto'
  )
  return (
    <div className="flex m-2">
      <div className={style}>
        <div className="flex gap-2 w-max">
          {!condition && <Skeleton className="h-6 w-6 bg-navycustom mr-auto" />}
          <Skeleton
            style={{ width: `${randomLength}px` }}
            className={`h-4 bg-slate-600`}
          />
          {condition && <Skeleton className="ml-auto h-6 w-6 bg-navycustom" />}
          {!!message.image && (
            <div className="p-2">
              <Skeleton className="w-52 h-52 bg-slate-600" />
            </div>
          )}
        </div>
        <div className="flex w-full">
          <div className={clsx(condition ? 'mr-auto' : 'ml-auto')}>
            <Skeleton className="w-10 h-2 bg-slate-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessageBox({
  message,
  currId,
  isLast,
}: {
  message: FullMessageType
  currId?: string
  isLast: boolean
}) {
  const style = clsx(
    `
    flex
    flex-col
    py-2
    px-4
    rounded-2xl
    shadow-lg
    ring-1
    ring-slate-200
  `,
    currId === message.senderId
      ? 'ml-auto bg-maroonlight'
      : 'mr-auto  bg-slate-300'
  )

  function formatDate(date: Date) {
    const now = new Date()
    const diffInDays = Math.floor(
      (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffInDays > 0) {
      // If the date is more than 1 day ago, return the date string
      return new Date(date).toLocaleDateString()
    } else {
      // If the date is today, return the time string in HH:MM:SS format
      return new Date(date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }
  }
  const [isOpen, setIsOpen] = useState(false)

  if (!currId) return LoadingSkeletal(message)

  const seenByString = message.seen
    .filter((user) => user.id !== message.senderId && user.id !== currId)
    .map((user) => user.username)
    .join(', ')

  return (
    <>
      <div className="flex m-2">
        <div className={style}>
          <div className="flex gap-2">
            {currId !== message.senderId && (
              <img
                src={message.sender.image || '/gengar.jpg'}
                className="mr-auto h-6 w-6"
              />
            )}
            <div className="text-sm">{message.body && message.body}</div>
            {currId === message.senderId && (
              <img
                src={message.sender.image || '/gengar.jpg'}
                className="ml-auto h-6 w-6"
              />
            )}
            {!!message.image && (
              <div className="p-2">
                <>
                  <ImageModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    imgSrc={message.image}
                  />
                  <div onClick={() => setIsOpen(!isOpen)}>
                    <img
                      src={message.image}
                      className="object-cover cursor-pointer w-52 h-52 hover:scale-105 transition"
                    />
                  </div>
                </>
              </div>
            )}
          </div>
          <div className="flex w-full">
            <div
              className={clsx(
                'text-[9px] text-gray-500',
                currId === message.senderId ? 'mr-auto' : 'ml-auto'
              )}
            >
              {formatDate(message.createdAt)}
            </div>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          `
        flex
        `
        )}
      >
        {isLast && (
          <div
            className={clsx(
              'text-xs pb-2 text-slate-200 px-2',
              currId === message.senderId ? 'ml-auto' : 'mr-auto'
            )}
          >
            {seenByString && `Seen by ${seenByString}`}
          </div>
        )}
      </div>
    </>
  )
}
