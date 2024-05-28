'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import UserBox from '../UserBox'
import { User } from '@prisma/client'
import FriendRequestBox from '../FriendRequestBox'
import useBearStore from '@/app/stores/bearStore'
import { set } from 'zod'
import { pusherClient } from '@/app/libs/pusher'
import { MeaningfulUserFields } from '@/app/types'

export default function Requests() {
  const session = useSession()
  const currentId = session.data?.user.id
  const {
    incomingRequests,
    sentRequests,
    setIncomingRequests,
    setSentRequests,
    addToIncomingRequests,
  } = useBearStore()

  useEffect(() => {
    if (!currentId) return
    const fetchRequests = async () => {
      const response = await axios.get(`/api/friends/requests/?id=${currentId}`)
      const requests = response.data as
        | {
            friendsRequest: MeaningfulUserFields[]
            sentFriendRequest: MeaningfulUserFields[]
          }
        | undefined
      if (requests) {
        setIncomingRequests(requests.friendsRequest)
        setSentRequests(requests.sentFriendRequest)
      }
    }
    fetchRequests()
  }, [currentId, setIncomingRequests, setSentRequests])

  useEffect(() => {
    const channel = pusherClient.subscribe(`friend-requests-${currentId}`)
    console.log('currentId', currentId)
    const newRequestHandler = (data: MeaningfulUserFields) => {
      addToIncomingRequests(data)
    }
    const sentRequestRejectedHandler = (data: MeaningfulUserFields) => {
      console.log(data, sentRequests)
      setSentRequests(
        sentRequests?.filter((sentReq) => sentReq.id !== data.id) || []
      )
    }

    const sentRequestAcceptedHandler = (data: MeaningfulUserFields) => {
      setSentRequests(
        sentRequests?.filter((sentReq) => sentReq.id !== data.id) || []
      )
    }

    channel.bind('new-request', newRequestHandler)
    channel.bind('sent-request-rejected', sentRequestRejectedHandler)
    channel.bind('sent-request-accepted', sentRequestAcceptedHandler)

    return () => {
      channel.unbind('new-request', newRequestHandler)
      channel.unbind('sent-request-rejected', sentRequestRejectedHandler)
      channel.unbind('sent-request-accepted', sentRequestAcceptedHandler)
      pusherClient.unsubscribe(`friend-requests-${currentId}`)
    }
  })

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
