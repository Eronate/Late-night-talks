'use client'

import clsx from 'clsx'
import React from 'react'

interface IButtonProps {
  children?: React.ReactNode[] | React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: string
  disabled?: boolean
}

export default function DeleteButton({
  children,
  onClick,
  type = 'button',
  variant,
  disabled,
}: IButtonProps) {
  const style = clsx(
    variant === 'primary' &&
      'bg-maroon text-white rounded-xl py-1 text-sm m-1 ring-1 ring-maroonlight hover:ring-2 focus:outline-none',
    variant === 'primary-selected' &&
      'bg-white text-maroon rounded-xl py-1 text-sm m-1 ring-1 ring-maroon hover:ring-2 focus:outline-none',
    variant === 'secondary' &&
      'bg-white text-maroon rounded-xl py-1 text-sm m-1 ring-1 ring-maroon hover:ring-2 focus:outline-none'
  )
  return (
    <button onClick={onClick} type={type} className={style} disabled={disabled}>
      {children}
    </button>
  )
}
