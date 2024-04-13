'use client'

import { User } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function useSelf() {
  const [self, setSelf] = useState<User | null>(null)
  const session = useSession()
  const currentId = session.data?.user.id
  console.log('currentId', currentId)
  useEffect(() => {
    if (!currentId) return

    const fetch = async () => {
      const response = await axios.get(`/api/user/?id=${currentId}`)
      const getSelf = response.data
      console.log('response', response.data)
      setSelf(getSelf)
    }
    fetch()
  }, [currentId, setSelf])
  return self
}
