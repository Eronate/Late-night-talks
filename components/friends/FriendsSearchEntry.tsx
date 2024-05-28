'use client'
import { User } from '@prisma/client'
import UserBox from '../UserBox'
import { useContext, useMemo, useState } from 'react'
import clsx from 'clsx'
import { FriendsContext } from './UtilityBox'
import Avatar from '../Avatar'

export default function FriendsSearchEntry({ user }: { user: User }) {
  const [chosenUser, setChosenUser] = useContext(FriendsContext)
  const isSelected = useMemo(
    () => chosenUser === user.id,
    [user.id, chosenUser]
  )
  const style = clsx(
    `
        w-full
        flex 
        shadow-md
        border-1 
        py-2 
        px-6 
        mt-1 
        rounded-xl 
        hover:bg-navylight
        hover:transition-colors 
        hover:cursor-pointer
        `,
    isSelected ? 'bg-navy2' : 'bg-customcoolcolor'
  )
  const handleClick = () => {
    setChosenUser(user.id)
  }
  return (
    <div onClick={handleClick} className={style}>
      <Avatar img={user.image} userEmail={user.email!} />
      <div className="flex ml-2 flex-col justify-center min-w-0 text-ellipsis whitespace-nowrap w-full">
        <div className="text-md text-slate-300">{user.username}</div>
      </div>
    </div>
  )
}
