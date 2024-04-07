"use client"

import clsx from "clsx"
import React from "react"

interface IButtonProps {
    children?: React.ReactNode[] | React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    variant?: string
    disabled?: boolean
}

export default function SocialButton({
    children,
    onClick,
    type='button',
    variant,
    disabled
}: IButtonProps) {
    const style = clsx(
        variant === 'google' && 'flex justify-center align-center bg-white text-black rounded-xl py-1 text-sm m-1 ring-1 ring-maroonlight hover:ring-2 focus:outline-none',
    )
    const image = variant === 'google' ? '/google.png' : ''
    return (
        <button onClick={onClick} type={type} className = {style} disabled={disabled}>
            <img src={image} alt="alt" className="w-5 h-5 rounded-lg text-slate-500 "/>
            <div className="ms-1 self-center">
                {children}
            </div>
        </button>
    )
}
