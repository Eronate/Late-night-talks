'use client'
import { User } from '@prisma/client'
import FriendsSearchEntry from './FriendsSearchEntry'

export default function FriendsSearchList({ users }: { users?: User[] }) {
  if (!users) return <></>

  return (
    <div className="flex w-full gap-2 px-2 flex-col">
      {users.map((user, index) => (
        <FriendsSearchEntry user={user} key={index} />
      ))}
    </div>
  )
}
