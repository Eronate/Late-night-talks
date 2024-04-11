import clsx from 'clsx'
import { Icon } from 'next/dist/lib/metadata/types/metadata-types'
import { ReactNode } from 'react'

interface IButtonProps {
  children?: ReactNode | ReactNode[]
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'selected'
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
      'bg-customcoolcolor hover:bg-navylight hover:text-slate-300',
    variant === 'selected' &&
      'bg-navylight hover:bg-customcoolcolor hover:text-slate-300'
  )
  return (
    <button onClick={onClick} disabled={disabled} type={type} className={style}>
      {children}
    </button>
  )
}
