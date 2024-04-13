'use client'
import { useSession } from 'next-auth/react'
import prisma from '@/app/libs/prismadb'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { User } from '@prisma/client'
import useBearStore from '../stores/bearStore'

export default function useFriends() {
  const { data: session } = useSession()

  const { friends, setFriends } = useBearStore()

  useEffect(() => {
    if (!session?.user) return
    const fetchOtherUsers = async () => {
      const users = await axios.get(`/api/friends/?id=${session.user.id}`)
      setFriends(users.data)
    }
    fetchOtherUsers()
  }, [session?.user, setFriends])

  return friends
}
