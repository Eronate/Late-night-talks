'use client'
import useOtherUsers from '@/app/hooks/useOtherUsers'
import UserBox from './UserBox'
import UtilityBox from './friends/UtilityBox'
import { createContext, useState } from 'react'
import Requests from './friends/Requests'

type contextType = 'friends' | 'requests' | null
export const FriendsOrRequestsContext = createContext<
  [contextType, React.Dispatch<React.SetStateAction<contextType>>]
>([null, () => {}] as [
  contextType,
  React.Dispatch<React.SetStateAction<contextType>>
])

export default function UsersList() {
  const [state, setState] = useState<contextType>('friends')
  const users = useOtherUsers()
  if (!users) return <></>
  return (
    <FriendsOrRequestsContext.Provider value={[state, setState]}>
      <div className="flex min-w-full sm:min-w-96 h-full bg-navycustom flex-col">
        <UtilityBox />
        {state === 'requests' ? (
          <Requests />
        ) : (
          users.map((u, index) => <UserBox key={index} user={u} />)
        )}
      </div>
    </FriendsOrRequestsContext.Provider>
  )
}
