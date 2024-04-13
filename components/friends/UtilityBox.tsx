'use client'
import { IoPersonAddOutline } from 'react-icons/io5'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import SearchBox from '../SearchBox'
import { User } from '@prisma/client'
import axios from 'axios'
import FriendsSearchList from './FriendsSearchList'
import { useSession } from 'next-auth/react'
import { createContext } from 'react'
import toast from 'react-hot-toast'
import Button from '../Button'
import { FriendsOrRequestsContext } from '../UsersList'
import useBearStore from '@/app/stores/bearStore'

export const FriendsContext = createContext([null, (user: string) => {}] as [
  string | null,
  React.Dispatch<React.SetStateAction<string | null>>
])

export default function UtilityBox() {
  const [search, setSearch] = useState('')
  const [usersFiltered, setUsersFiltered] = useState<User[]>([])
  const [chosenUser, setChosenUser] = useState<string | null>(null)
  const [state, setState] = useContext(FriendsOrRequestsContext)
  const {
    incomingRequests,
    sentRequests,
    setIncomingRequests,
    setSentRequests,
  } = useBearStore()

  const session = useSession()

  const InjectUsersIntoState = useCallback(
    async (search: string) => {
      const response = await axios.get('/api/users')
      const users = response.data as User[] | undefined
      if (!users) return

      setUsersFiltered(
        users.filter((user) => {
          const userContainsSearch = user!.username!.includes(
            search.split('#')[0]
          )
          const searchHasTag = search.split('#').length > 1
          const userHasSearchedTag = user!
            .tag!.toString()
            .includes(search.split('#')[1])
          const isDifferentFromLoggedInUser =
            session.data?.user.username !== user.username
          if (searchHasTag)
            return (
              userContainsSearch &&
              userHasSearchedTag &&
              isDifferentFromLoggedInUser
            )
          return userContainsSearch && isDifferentFromLoggedInUser
        })
      )
    },
    [session.data?.user.username]
  )

  useEffect(() => {
    InjectUsersIntoState(search)
  }, [search, InjectUsersIntoState])

  const sendFriendRequest = useCallback(() => {
    if (!chosenUser) return
    else
      axios
        .post('/api/friends/add', {
          sender: session.data?.user.id,
          receiver: chosenUser,
        })
        .then((res) => {
          if (res.status === 200) {
            const usernameSentTo = res.data.username
            setSentRequests([...(sentRequests || []), res.data] as User[])
            toast.success(`Friend request sent to ${usernameSentTo}!`)
          }
          if (res.status === 201) {
            toast(res.data.error || 'You cannot do that.')
          }
        })
        .catch((err: any) => {
          toast.error('Error in sending friend request')
        })
  }, [chosenUser, session.data?.user.id, setSentRequests, sentRequests])

  const AddFriendModal = useMemo(() => {
    return (
      <Dialog>
        <DialogTrigger className="flex flex-nowrap">
          <Button>
            <div className="flex">Add a friend</div>
            <IoPersonAddOutline className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-navycustom p-4 w-full">
          <div className="flex p-4 flex-col gap-4 w-full">
            <DialogTitle className="text-slate-400">Add a friend</DialogTitle>
            <SearchBox
              placeholder="LoomingCharizard#1324"
              search={search}
              setSearch={setSearch}
            />
            <div className="flex h-80 overflow-y-auto flex-grow-1">
              <FriendsContext.Provider value={[chosenUser, setChosenUser]}>
                <FriendsSearchList users={usersFiltered} />
              </FriendsContext.Provider>
            </div>
          </div>
          <DialogTrigger>
            <button
              disabled={!!!chosenUser}
              onClick={sendFriendRequest}
              className="text-sm shadow-xl z-30 sticky top-0 border-navylight p-3 bg-customcoolcolor transition-colors text-slate-400 rounded-full w-max ml-auto hover:bg-navylight"
            >
              Send friend request
            </button>
          </DialogTrigger>
        </DialogContent>
      </Dialog>
    )
  }, [chosenUser, search, sendFriendRequest, usersFiltered])

  if (!session.data?.user) return <></>

  return (
    <div className="flex flex-col w-full p-2 ">
      <div className="text-2xl p-2 text-slate-400">Friends list</div>

      <div className="flex flex-row justify-around">
        <Button
          onClick={() => setState(state === 'friends' ? 'requests' : 'friends')}
          variant={state === 'friends' ? 'selected' : 'primary'}
        >
          <div className="flex">
            {state === 'friends' ? 'See requests' : 'See friends'}
          </div>
          <IoPersonAddOutline className="w-5 h-5" />
        </Button>
        {AddFriendModal}
      </div>
    </div>
  )
}
