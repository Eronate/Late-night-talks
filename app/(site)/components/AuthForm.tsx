'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  FieldError,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import Input from './Input'
import { InputProps } from '@/app/types/Input'
import Button from './Button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { signIn, useSession } from 'next-auth/react'
import SocialButton from './SocialButton'
import { loginSchema, registerSchema } from '@/app/types/RegisterType'
import { zodResolver } from '@hookform/resolvers/zod'

type variant = 'LOGIN' | 'REGISTER'

interface LoginBoxProps extends InputProps {
  text: string
}

export default function AuthForm() {
  const [variant, setVariant] = useState<variant>('LOGIN')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/users')
    }
  }, [status, session, router])

  const schema = useMemo(() => {
    if (variant === 'REGISTER') return registerSchema
    else return loginSchema
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
    resetOptions: {
      keepValues: true,
      keepErrors: false,
    },
    criteriaMode: 'all',
  })

  const socialAction = (action: string) => {
    setIsLoading(true)
    signIn(action)
      .then((cb) => {
        if (cb?.error) {
          toast.error('Invalid Credentials')
        }
        if (cb?.ok && !cb?.error) {
          toast.success('Logged in')
        }
      })
      .finally(() => setIsLoading(false))
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    if (variant === 'REGISTER') {
      try {
        axios
          .post('/api/register', data)
          .then(() => {
            toast.success('Your account has been created!')
            setIsLoading(false)
          })
          .then(() => signIn('credentials', data))
      } catch (err) {
        console.log(err)
        toast.error('Invalid credentials')
        setIsLoading(false)
      }
    }
    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...{ email: data.email, password: data.password },
        redirect: false,
      })
        .then((cb) => {
          if (cb?.error) toast.error('Invalid credentials')

          if (cb?.ok) toast.success('Logged in')
        })
        .finally(() => setIsLoading(false))
    }
  }

  const FieldsForAuthForm = useMemo(() => {
    return (
      <div className="height-[80%]">
        {variant === 'REGISTER' && (
          <div className="flex flex-col mt-4 gap-1">
            <div className="flex text-xs text-gray-700">Your username</div>
            <Input
              key="username"
              errors={errors['username'] as FieldError}
              disabled={isLoading}
              label="username"
              register={register}
              required={true}
              placeholder="Enter your username"
            />
          </div>
        )}

        <div className="flex flex-col mt-4 gap-1">
          <div className="flex text-xs text-gray-700">Your email</div>
          <Input
            key="email"
            errors={errors['email'] as FieldError}
            disabled={isLoading}
            label="email"
            register={register}
            required={true}
            placeholder="Enter your email"
          />
        </div>

        <div className="flex flex-col mt-4 gap-1">
          <div className="flex text-xs text-gray-700">Your password</div>
          <Input
            key="password"
            errors={errors['password'] as FieldError}
            disabled={isLoading}
            label="password"
            register={register}
            required={true}
            placeholder="Enter your password"
          />
        </div>
      </div>
    )
  }, [errors, isLoading, register, variant])

  const toggleVariant = () => {
    variant === 'LOGIN' ? setVariant('REGISTER') : setVariant('LOGIN')
    reset({
      keepValues: true,
    })
  }

  const RegisterOrLogin = () => {
    const button =
      variant === 'LOGIN' ? (
        <Button type="submit" variant="primary" disabled={isLoading}>
          Login
        </Button>
      ) : (
        <Button type="submit" variant="primary" disabled={isLoading}>
          Register
        </Button>
      )

    const headsUp =
      variant === 'LOGIN' ? (
        <div className="text-sm text-gray-500">
          Or you are new here?
          <button
            className="underline ml-1"
            type="button"
            onClick={toggleVariant}
          >
            {' '}
            Register
          </button>{' '}
          now!
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          Or you already have an account?
          <button
            className="underline ml-1"
            type="button"
            onClick={toggleVariant}
          >
            {' '}
            Login
          </button>{' '}
          now!
        </div>
      )

    return (
      <div className="flex flex-col mt-8 gap-3">
        {button}
        <SocialButton onClick={() => socialAction('google')} variant="google">
          Sign in with Google
        </SocialButton>
        {headsUp}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <div className="bg-gradient-to-r from-navycustom to-maroon flex justify-center content-center h-full p-2 flex-wrap-1">
        <div className="flex justify-center content-center p-4 h-100 w-100 flex-wrap-1">
          <div className="shadow-lg hidden md:flex">
            <img src="/latenighttalks.jpg" alt="latenighttalks" />
          </div>
          <div className="bg-white p-8 flex flex-col justify-center h-full border-maroon shadow-lg">
            <div className="flex flex-col mt-1 justify-around content-center">
              <div className="flex text-gray-700 sm:text-3xl text-nowrap text-lg justify-center opacity-75 font-bold">
                Late night talks
              </div>
              <div className="height-[80%]">{FieldsForAuthForm}</div>
              <RegisterOrLogin />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
