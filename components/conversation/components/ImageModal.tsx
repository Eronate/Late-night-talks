'use client'
import { Dialog, Transition } from '@headlessui/react'
import { Dispatch, Fragment, SetStateAction } from 'react'
import { IoCloseSharp } from 'react-icons/io5'

export default function ImageModal({
  isOpen,
  setIsOpen,
  imgSrc,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  imgSrc: string
}) {
  return (
    // <Dialog
    //   open={isOpen}
    //   onClose={() => setIsOpen(false)}
    //   className="relative z-100"
    // >
    //   <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    //   <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
    //     <Dialog.Panel>
    //       <div>aaaa</div>
    //       <img src={imgSrc} className="max-h-screen max-w-screen" />
    //     </Dialog.Panel>
    //   </div>
    // </Dialog>
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div
                  className="absolute top-0 right-0 p-4"
                  onClick={() => setIsOpen(false)}
                >
                  <IoCloseSharp className="w-10 h-10 p-[2px] rounded-full hover:bg-gray-700 hover:bg-opacity-75 cursor-pointer transition-colors" />
                </div>
                <img src={imgSrc} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
