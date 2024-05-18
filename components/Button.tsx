import clsx from 'clsx'
import { ReactNode } from 'react'

interface IButtonProps {
  children?: ReactNode | ReactNode[]
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'selected' | 'danger'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}
export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className,
  type = 'button',
}: IButtonProps) {
  let style = clsx(
    className +
      'border border-2 border-navy2 text-sm p-2 transition-colors text-slate-400 flex flex-row gap-2 p-3 rounded-full shadow-lg ',
    variant === 'primary' &&
      'bg-customcoolcolor hover:bg-navylight hover:text-white',
    variant === 'selected' &&
      'bg-navylight hover:bg-customcoolcolor hover:text-white',
    disabled === true && 'opacity-25',
    variant === 'danger' && 'bg-red-700 hover:bg-red-500 hover:text-white'
  )
  return (
    <button onClick={onClick} disabled={disabled} type={type} className={style}>
      {children}
    </button>
  )
}
