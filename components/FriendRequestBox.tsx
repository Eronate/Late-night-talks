import { User } from '@prisma/client'
import clsx from 'clsx'
import { IoClose } from 'react-icons/io5'
import { TiTick } from 'react-icons/ti'

export default function FriendRequestBox({
  user,
  variant,
}: {
  user: User
  variant: 'incoming' | 'sent'
}) {
  const style = clsx(
    'w-full flex shadow-md border-maroonlight border-1 p-3 mt-1 rounded-xl hover:transition-colors',
    variant === 'incoming' && 'bg-customcoolcolor',
    variant === 'sent' && 'bg-slate-400 hover:bg-slate-500 bg-opacity-20'
  )
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
            <TiTick className="w-7 h-7 cursor-pointer text-black2 hover:bg-navylight rounded-lg transition-colors" />
            <IoClose className="w-7 h-7 cursor-pointer text-black2 hover:bg-navylight rounded-lg transition-colors" />
          </div>
        ) : (
          <IoClose className="ml-auto w-7 h-7 cursor-pointer text-black2 hover:bg-slate-400 rounded-lg transition-colors" />
        )}
      </div>
    </div>
  )
}
