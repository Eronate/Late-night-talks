import { useParams } from 'next/navigation'
import { useMemo } from 'react'

const useConversation = () => {
  const params = useParams()

  const conversationId = useMemo(() => {
    if (!params || !params.conversationId) return ''
    return params.conversationId as string
  }, [params])

  const isOpen = useMemo(() => !!conversationId, [conversationId])

  const conversationDetails = useMemo(() => {
    return {
      isOpen,
      conversationId,
    }
  }, [isOpen, conversationId])

  return conversationDetails
}

export default useConversation
