import { Transition } from '@headlessui/react'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog } from '@headlessui/react'
import Button from '@/components/Button'
import { FullConversationType } from '@/app/types'
import useOtherUserConversation, {
  useOtherUsersConversation,
} from '@/app/hooks/useOtherUserConversation'
import Avatar from '@/components/Avatar'
import { XIcon } from 'lucide-react'
import { FaTrashAlt } from 'react-icons/fa'
import DialogConfirm from './DialogConfirm'
import { Titillium_Web } from 'next/font/google'
import AvatarGroup from '../AvatarGroup'

interface ProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  conversation: FullConversationType
}

const ProfileDrawer = ({
  isOpen,
  onClose,
  conversation,
}: ProfileDrawerProps) => {
  const otherUsers = useOtherUsersConversation(conversation)
  const [title, setTitle] = useState<string | null>()
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)

  useEffect(() => {
    if (!otherUsers) return
    setTitle(() => {
      if (conversation.name) return conversation.name
      if (!conversation.isGroup) return otherUsers[0].username
      return otherUsers.map((users) => users.username).join(', ')
    })
  }, [setTitle, conversation, otherUsers])

  const isGroup = useMemo(() => conversation.isGroup, [conversation])
  const emailSection = useMemo(() => {
    return otherUsers?.map((user) => user.email).join(', ')
  }, [otherUsers])
  const createdAt = useMemo(() => conversation.createdAt, [conversation])

  return (
    <>
      <DialogConfirm
        isOpen={isOpenConfirmModal}
        setIsOpen={setIsOpenConfirmModal}
      />
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          unmount={false}
          onClose={onClose}
          className="fixed right-0 inset-y-0 z-30 h-screen flex w-72 justify-center items-center"
        >
          <div className="flex h-screen w-full">
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-in duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-30"
              entered="opacity-30"
              leave="transition-opacity ease-out duration-300"
              leaveFrom="opacity-30"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="z-30" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div
                className={`flex flex-col bg-navycustom z-50
                        w-full max-w-sm p-6 overflow-hidden text-left
                        align-middle shadow-xl`}
              >
                <button
                  className="flex ml-auto hover:cursor-pointer w-max rounded-full transition-colors hover:bg-slate-300 hover:bg-opacity-20"
                  onClick={onClose}
                >
                  <XIcon className="h-6 w-6" />
                </button>
                <div className="mt-4">
                  <Dialog.Title className="font-semibold text-xl md:text-2xl text-white w-full">
                    <div className="flex flex-col w-full gap-2">
                      <div className="flex justify-center">
                        {!isGroup && (
                          <Avatar img={otherUsers![0].image || '/gengar.jpg'} />
                        )}
                        {isGroup && <AvatarGroup users={otherUsers || []} />}
                      </div>
                      <div className="flex justify-center">{title}</div>
                    </div>
                  </Dialog.Title>
                  <div className="text-xs text-slate-200 text-center mt-1">
                    {!isGroup && (
                      <div>
                        Joined at{' '}
                        {otherUsers![0].createdAt.toLocaleDateString()}
                      </div>
                    )}
                    {isGroup && (
                      <div>Created at {createdAt.toLocaleDateString()}</div>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 text-center mt-1">
                    {emailSection}
                  </div>

                  <div className="flex flex-col mt-10 gap-2">
                    <div className="text-xs text-slate-400 text-center">
                      Delete conversation
                    </div>
                    <div
                      className="flex mx-auto hover:cursor-pointer p-2 w-max text-red-400 rounded-full transition-colors hover:bg-slate-300 hover:bg-opacity-20"
                      onClick={() => setIsOpenConfirmModal(true)}
                    >
                      <FaTrashAlt className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ProfileDrawer
