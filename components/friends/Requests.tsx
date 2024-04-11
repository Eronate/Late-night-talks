'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import UserBox from '../UserBox'
import { User } from '@prisma/client'
import FriendRequestBox from '../FriendRequestBox'

export default function Requests() {
  const session = useSession()
  const currentId = session.data?.user.id
  const [incomingRequests, setIncomingRequests] = useState<User[] | null>([])
  const [sentRequests, setSentRequests] = useState<User[] | null>([])
  useEffect(() => {
    if (!currentId) return
    const fetchRequests = async () => {
      const response = await axios.get(`/api/friends/requests/?id=${currentId}`)
      const requests = response.data as
        | { friendsRequest: User[]; sentFriendRequest: User[] }
        | undefined
      if (requests) {
        setIncomingRequests(requests.friendsRequest)
        setSentRequests(requests.sentFriendRequest)
      }
    }
    fetchRequests()
  }, [currentId])

  return (
    <div className="flex p-3 flex-col">
      <div className="text-md text-slate-300 p-2 text-center">
        Incoming requests
      </div>
      {(incomingRequests || []).map((req, index) => (
        <FriendRequestBox key={index} user={req} variant="incoming" />
      ))}
      <div className="text-md text-slate-300 text-center p-2">
        Sent requests
      </div>
      {(sentRequests || []).map((req, index) => (
        <FriendRequestBox key={index} user={req} variant="sent" />
      ))}
    </div>
  )
}
