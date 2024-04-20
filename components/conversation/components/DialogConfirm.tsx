'use client'
import React, { Dispatch, useCallback } from 'react'
import { Dialog } from '@headlessui/react'
import Button from '@/components/Button'
import useConversation from '@/app/hooks/useConversation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const DialogConfirm = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<React.SetStateAction<boolean>>
}) => {
  const { conversationId } = useConversation()
  const router = useRouter()
  const handleDeleteConversation = useCallback(async () => {
    try {
      if (!conversationId) return
      const response = await axios.delete(
        `/api/conversations/${conversationId}`
      )
      setIsOpen(false)
      router.push('/conversations')
      router.refresh()
      toast.success('Conversation deleted successfully')
    } catch (err) {
      console.log(err)
      setIsOpen(false)
      toast.error('Failed to delete conversation')
    }
  }, [conversationId, router, setIsOpen])

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="shadow-2xl ring-1 ring-black mx-auto max-w-96 bg-navycustom rounded-lg p-4 text-center text-lg text-slate-300 gap-7 flex flex-col">
          <Dialog.Title>
            <div className="font-semibold">
              Are you sure you want to delete this conversation?
            </div>
          </Dialog.Title>
          <div className="flex text-wrap text-sm ">
            This action cannot be undone and the conversation data will not be
            able to be recovered.
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConversation}>
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default DialogConfirm
