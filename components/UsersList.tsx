'use client'
import useFriends from '@/app/hooks/useFriends'
import UserBox from './UserBox'
import UtilityBox from './friends/UtilityBox'
import { createContext, useState } from 'react'
import Requests from './friends/Requests'
import Self from './Self'

type contextType = 'friends' | 'requests' | null
export const FriendsOrRequestsContext = createContext<
  [contextType, React.Dispatch<React.SetStateAction<contextType>>]
>([null, () => {}] as [
  contextType,
  React.Dispatch<React.SetStateAction<contextType>>
])

export default function UsersList() {
  const [state, setState] = useState<contextType>('friends')
  const friends = useFriends()
  console.log(friends)
  if (!friends) return <></>
  return (
    <FriendsOrRequestsContext.Provider value={[state, setState]}>
      <div className="flex min-w-full sm:min-w-96 bg-navycustom flex-col max-h-full">
        <UtilityBox />
        {state === 'requests' ? (
          <Requests />
        ) : (
          <div className="max-h-[60vh] sm:max-h-[90vh] overflow-y-auto shadow-lg">
            {(friends || []).map((u, index) => (
              <UserBox key={index} user={u} />
            ))}
          </div>
        )}
        <div className="flex w-full mt-auto mb-10 sm:mb-0">
          <Self />
        </div>
      </div>
    </FriendsOrRequestsContext.Provider>
  )
}
