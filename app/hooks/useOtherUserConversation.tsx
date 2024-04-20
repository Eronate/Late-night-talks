import { useSession } from 'next-auth/react'
import { FullConversationType } from '../types'

export default function useOtherUserConversation(
  conversation: FullConversationType
) {
  const session = useSession()
  const currentUser = session.data?.user

  if (!currentUser) return null

  const users = conversation.users
  const otherUsers = users.filter((user) => user.id !== currentUser.id)
  return otherUsers[0]
}
