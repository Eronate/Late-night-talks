'use client'

import { User } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function useSelf() {
  const [self, setSelf] = useState<User | null>(null)
  const session = useSession()

  useEffect(() => {
    const currentId = session.data?.user.id
    if (!currentId) return

    const fetch = async () => {
      const response = await axios.get(`/api/user/?id=${currentId}`)
      const getSelf = response.data

      setSelf(getSelf)
    }
    fetch()
  }, [session, setSelf])
  return self
}
