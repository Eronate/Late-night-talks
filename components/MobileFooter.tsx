"use client"
import useNavButtons, { INavButton } from "@/app/hooks/useNavButtons"
import { useRouter } from "next/navigation"

export default function MobileFooter() {
    const buttons = useNavButtons()
    const router = useRouter()
    const handleClick = (btn: INavButton) => {
        if(btn.path)
            router.push(btn.path)
        if(btn.onClick)
            btn.onClick()
    }
    return (
        <div className="sm:hidden flex flex-row fixed bottom-0 left-0 h-max w-full bg-white p-2">
            {
            buttons.map((btn, index) => <button className="w-full justify-center flex h-max shadow-sm"
                key={index}
                onClick={() => handleClick(btn)}
            >
                {btn.icon}
            </button>)}
        </div>
    )
}
