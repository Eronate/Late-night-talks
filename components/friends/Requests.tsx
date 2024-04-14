'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import UserBox from '../UserBox'
import { User } from '@prisma/client'
import FriendRequestBox from '../FriendRequestBox'
import useBearStore from '@/app/stores/bearStore'
import { set } from 'zod'

export default function Requests() {
  const session = useSession()
  const currentId = session.data?.user.id
  const {
    incomingRequests,
    sentRequests,
    setIncomingRequests,
    setSentRequests,
  } = useBearStore()

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
  }, [currentId, setIncomingRequests, setSentRequests])

  const popSentRequest = useCallback(
    (userId: string) => {
      setSentRequests(
        sentRequests?.filter((sentReq) => sentReq.id !== userId) || []
      )
    },
    [sentRequests, setSentRequests]
  )

  const popIncomingRequest = useCallback(
    (userId: string) => {
      setIncomingRequests(
        incomingRequests?.filter((sentReq) => sentReq.id !== userId) || []
      )
    },
    [incomingRequests, setIncomingRequests]
  )

  return (
    <div className="flex p-3 flex-col overflow-y-auto">
      <div className="text-md text-slate-300 p-2 text-center">
        Incoming requests
      </div>

      <div className="flex-grow">
        {(incomingRequests || []).map((req, index) => {
          return (
            <FriendRequestBox
              key={index}
              user={req}
              variant="incoming"
              popFromState={popIncomingRequest}
            />
          )
        })}
      </div>

      <div className="text-md text-slate-300 text-center p-2">
        Sent requests
      </div>
      <div className="flex-grow">
        {(sentRequests || []).map((req, index) => (
          <FriendRequestBox
            key={index}
            user={req}
            variant="sent"
            popFromState={popSentRequest}
          />
        ))}
      </div>
    </div>
  )
}
