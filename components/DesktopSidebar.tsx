"use client"
import useNavButtons, { INavButton } from "@/app/hooks/useNavButtons"
import { useRouter } from "next/navigation"

export default function DesktopSidebar() {
    const buttons = useNavButtons()
    const router = useRouter()
    const handleClick = (btn: INavButton) => {
        if(btn.path)
            router.push(btn.path)
        if(btn.onClick)
            btn.onClick()
    }
    return (
        <div className="hidden sm:flex flex-col w-max h-full bg-slate-200 p-2 gap-5">
            {
            buttons.map((btn, index) => <button className="w-full justify-center flex h-max shadow-sm "
                key={index}
                onClick={() => handleClick(btn)}
            >
                {btn.icon}
            </button>)}
        </div>
    )
}
