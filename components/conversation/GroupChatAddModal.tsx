import { Dialog } from '@headlessui/react'
import { Dispatch } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import Select from './Select'
import UserBox from '../UserBox'
import { User } from '@prisma/client'
import useFriends from '@/app/hooks/useFriends'
import Button from '../Button'
import axios from 'axios'
import toast from 'react-hot-toast'
import Input from '@/app/(site)/components/Input'
import { set } from 'zod'
import { useSession } from 'next-auth/react'

interface IGroupChatAddModalProps {
  isOpen: boolean
  setIsOpen: Dispatch<React.SetStateAction<boolean>>
  friends?: User[]
}

export default function GroupChatAddModal({
  isOpen,
  setIsOpen,
}: IGroupChatAddModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      userIds: [],
    },
  })
  const userIds = watch('userIds')
  const session = useSession()
  const friends = useFriends()

  const onSubmit = (data: FieldValues) => {
    if (!session.data) return null
    const response = axios
      .post('/api/conversations', {
        users: data.userIds.concat(session.data.user.id),
        name: data.name,
        isGroup: true,
      })
      .then((resp) => {
        setIsOpen(false)
        toast.success('Conversation created')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Could not create conversation')
      })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="shadow-2xl ring-1 ring-black mx-auto w-[80vw] sm:w-[40vw]  bg-navycustom rounded-lg p-4 text-center text-lg text-slate-300 gap-7 flex flex-col">
            <Dialog.Title>
              <div className="font-semibold">Create a group chat</div>
              <div className="flex text-wrap text-sm mt-4">
                Add 2 or more users to a conversation
              </div>
            </Dialog.Title>

            <Input
              register={register}
              label="name"
              placeholder="Name of the conversation"
            />

            <div className="flex text-wrap text-sm ">
              Select users to add to the conversation
            </div>
            <Select
              options={(friends || []).map((friend) => ({
                value: friend.id,
                label:
                  // (
                  //   <div className="text-xs text-slate-700 flex items-center gap-2 w-full">
                  //     <img
                  //       src={friend.image || '/gengar.jpg'}
                  //       className="w-8 h-8 rounded-full"
                  //     />
                  //     {friend.username}
                  //   </div>
                  // ),
                  friend.username,
              }))}
              onChange={(userEmailsFromSelect) => {
                setValue(
                  'userIds',
                  userEmailsFromSelect.map((user) => user.value)
                )
              }}
              isMulti
            />
            <div className="w-50 flex justify-center">
              <Button type="submit" disabled={userIds.length < 2}>
                Create conversation
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </form>
    </Dialog>
  )
}
