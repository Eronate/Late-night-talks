'use client'
import { Dialog } from '@headlessui/react'
import { Dispatch, useState } from 'react'
import Button from './Button'
import { registerSchema } from '@/app/types/RegisterType'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FieldError,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Input from '@/app/(site)/components/Input'
import { CldUploadButton } from 'next-cloudinary'
import { useSession } from 'next-auth/react'
import { LucidePlusCircle } from 'lucide-react'
import { User } from '@prisma/client'

interface SettingsModalProps {
  isOpen: boolean
  setIsOpen: Dispatch<React.SetStateAction<boolean>>
}

export default function SettingsModal({
  isOpen,
  setIsOpen,
}: SettingsModalProps) {
  const router = useRouter()
  const session = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      username: '',
      image: null,
    },
  })

  const image = watch('image')

  const handleUpload = (result: any) => {
    try {
      setValue('image', result?.info?.secure_url, {
        shouldValidate: true,
      })
    } catch (err) {
      console.log(err)
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    try {
      console.log('Data from settings', data)
      const fetchData = async () => {
        if (!session.data?.user.id) return
        const response = await axios.post('/api/settings', {
          ...data,
          id: session.data.user.id,
        })
        const responseData: User = response.data
        setIsOpen(false)
        await session.update({
          ...session.data,
          user: {
            ...session.data.user,
            image: responseData.image,
            username: responseData.username,
          },
        })
        console.log('Session after update', session.data)
        router.refresh()
      }
      fetchData()
    } catch (err) {
      toast.error('Something went wrong!')
    }
  }

  if (!session.data) return <></>
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="shadow-2xl ring-1 ring-black mx-auto max-w-96 bg-navycustom rounded-lg p-4 flex flex-col">
            <Dialog.Title>
              <div className="font-semibold text-center text-lg text-slate-300 ">
                Update your details
              </div>
            </Dialog.Title>
            <div className="flex w-full mt-8 flex-col">
              <div className="text-xs text-slate-400">Username</div>
              <Input
                key="username"
                errors={errors['username'] as FieldError}
                disabled={isLoading}
                options={{ minLength: 3, maxLength: 20 }}
                label="username"
                register={register}
                placeholder="Enter your username"
              />
            </div>
            <div className="flex w-full items-center mt-8 gap-2">
              <img
                src={image || session.data.user.image}
                className="w-8 h-8 rounded-full "
              />
              <CldUploadButton
                options={{ maxFiles: 1 }}
                onSuccess={handleUpload}
                uploadPreset="cwugbfav"
              >
                <LucidePlusCircle className="w-8 h-8 hover:cursor-pointer text-maroon rounded-full transition-colors hover:bg-slate-300 hover:bg-opacity-20" />
              </CldUploadButton>
              <div className="text-sm ml-3 text-slate-300">
                Edit your profile picture
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit">
                Save changes
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </form>
    </Dialog>
  )
}
