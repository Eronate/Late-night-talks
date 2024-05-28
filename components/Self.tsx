'use client'
import useSelf from '@/app/hooks/useSelf'
import UserBox from './UserBox'
import { IoSettings } from 'react-icons/io5'
import SettingsModal from './SettingsModal'
import { useState } from 'react'
import { Skeleton } from './ui/skeleton'

export default function Self() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const self = useSelf()
  if (!self)
    return (
      <div className="w-full flex shadow-md flex-shrink h-auto border-1 p-3 mt-1 bg-customcoolcolor">
        <div className="flex">
          <div className="w-max relative h-max shadow-xl ">
            <Skeleton className="w-[70px] h-[70px] bg-gray-500" />
            <Skeleton className="absolute top-0 right-0 w-2 h-2 ring-4 z-50 ring-gray-500" />
          </div>
        </div>
        <div className="flex ml-2 flex-col justify-start min-w-0 text-ellipsis whitespace-nowrap w-full">
          <div className="flex items-center w-full">
            <Skeleton className="w-[50px] sm:w-[5vw] h-[2vh] bg-gray-500" />
            <Skeleton className="w-[50px] sm:w-[3vw] h-[2vh] bg-gray-500" />
            <div className="hover:cursor-pointer text-gray-500 ml-auto">
              <Skeleton className="h-6 w-6 bg-gray-500 " />
            </div>
          </div>
          <div className="w-full flex flex-row">
            <Skeleton className="w-[50px] sm:w-[3vw] h-[2vh] bg-gray-500"></Skeleton>
          </div>
        </div>
      </div>
    )
  return (
    <>
      <SettingsModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />
      <div className="w-full flex shadow-md flex-shrink h-auto bg-customcoolcolor border-maroonlight border-1 p-3 mt-1">
        <div className="flex">
          <div className="w-max relative h-max shadow-xl rounded-full ">
            <img
              src={self.image || '/gengar.jpg'}
              className="w-16 h-16 border-dotted border-2 shadow-lg border-black"
            />
            <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 ring-navycustom ring-4 z-50 rounded-full" />
          </div>
        </div>
        <div className="flex ml-2 flex-col justify-start min-w-0 text-ellipsis whitespace-nowrap w-full">
          <div className="flex items-center w-full">
            <div className="text-2xl text-slate-300">{self.username}</div>
            <div className="text-sm text-slate-500">#{self.tag}</div>
            <div
              className="hover:cursor-pointer text-gray-400 ml-auto"
              onClick={() => setIsOpenModal(true)}
            >
              <IoSettings className="h-6 w-6 " />
            </div>
          </div>

          <div className="w-full flex flex-row">
            <div className="text-lg text-slate-400 max-w-[70%] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
              {self.status}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
