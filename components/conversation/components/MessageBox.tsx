import { FullMessageType } from '@/app/types'
import { Message } from '@prisma/client'
import clsx from 'clsx'
import { useState } from 'react'
import ImageModal from './ImageModal'

export default function MessageBox({
  message,
  currId,
  isLast,
}: {
  message: FullMessageType
  currId: string
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
  const seenByString = message.seen
    .filter((user) => user.id !== message.senderId && user.id !== currId)
    .map((user) => user.username)
    .join(', ')

  return (
    <>
      <div className="flex m-2">
        <div className={style}>
          <div className="flex gap-2">
            <img
              src={message.sender.image || '/gengar.jpg'}
              className="h-6 w-6"
            />
            <div className="text-sm">{message.body && message.body}</div>
            <div className="p-2">
              {!!message.image && (
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
              )}
            </div>
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
              'text-[10px] text-slate-200 pb-2 px-2',
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
