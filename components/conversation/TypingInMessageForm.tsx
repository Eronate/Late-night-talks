'use client'
import Button from '@/app/(site)/components/Button'
import Input from '@/app/(site)/components/Input'
import useConversation from '@/app/hooks/useConversation'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useCallback, useContext, useState } from 'react'
import { RiSendPlane2Fill } from 'react-icons/ri'
import { FaImage } from 'react-icons/fa6'
import { CldUploadButton } from 'next-cloudinary'

export default function TypingInMessageForm() {
  const { conversationId } = useConversation()

  const session = useSession()

  const [input, setInput] = useState('')

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!session.data?.user.id) return

      try {
        const response = await axios.post('/api/messages', {
          input: input,
          conversationId: conversationId,
          sender: session.data.user.id,
        })
        setInput('')
      } catch (error) {
        console.log(error)
      }
    },
    [conversationId, session.data, input]
  )

  const handleUpload = (result: any) => {
    if (!session.data?.user.id) return
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId: conversationId,
      sender: session.data.user.id,
    })
  }

  return (
    <div className="border-navylight h-max text-xs w-full mt-auto flex gap-1">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="cwugbfav"
      >
        <FaImage className="h-6 w-6 text-navylight" />
      </CldUploadButton>
      <form onSubmit={handleSubmit} className="flex w-full">
        <input
          type="text"
          placeholder="Type a message..."
          className="p-2 rounded-sm ring-navylight flex-grow ring-1 focus:ring-2 focus:outline-none text-navycustom shadow-md"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
        />
        <Button type="submit">
          <RiSendPlane2Fill className="w-7 h-7 text-maroonlight hover:text-maroon transition-colors" />
        </Button>
      </form>
    </div>
  )
}
