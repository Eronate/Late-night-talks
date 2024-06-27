'use client'

import { InputProps } from '@/app/types/Input'
import ErrorMessage from './ErrorMessage'

export default function Input({
  label,
  register,
  required,
  placeholder,
  options,
  disabled,
  errors,
  type,
}: InputProps) {
  return (
    <div className="border-navylight text-xs w-full">
      <input
        {...register(label, { required, ...options })}
        disabled={disabled}
        type={type || 'text'}
        placeholder={placeholder}
        className="p-2 rounded-sm ring-navylight ring-1 focus:ring-2 focus:outline-none w-full text-navycustom shadow-md"
      />
      <ErrorMessage errors={errors} />
    </div>
  )
}
