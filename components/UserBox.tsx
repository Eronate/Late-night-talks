"use client"
import getCurrentSession from "@/app/utils/getCurrentSession";
import { Conversation, User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EventHandler, MouseEvent } from "react";

export default function UserBox({
    user
}: {user: User}) {

    const router = useRouter()
    const session = useSession()

    const handleClick = async (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, user: User) => {
        if(!session.data)
            return null;
        const response = await axios.post('/api/conversations/', {
            users: [
                session?.data.user?.email,
                user.email
            ]
        })
        const conversation: Conversation | null = response.data
        if(!conversation)
            return null;
        router.push(`/conversations/${conversation.id}`)
    }

    return (
        <div
        onClick={(e) => handleClick(e, user)} 
        className="w-full flex shadow-md border-maroonlight border-1 p-3 mt-1 bg-navycustom rounded-xl hover:bg-customcoolcolor hover:transition-colors hover:cursor-pointer">
            <div className="flex">
                <div className="w-max relative h-max shadow-xl rounded-full">
                    <img src={user.image || "/gengar.jpg"} className="w-10 h-10 rounded-full"/>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 ring-navycustom ring-4 z-50 rounded-full"/>
                </div>
            </div>
            <div className="flex ml-2 flex-col justify-start min-w-0 text-ellipsis whitespace-nowrap w-full">
                <div className="text-md text-slate-300">
                {user.username}
                </div>
                <div className="w-full flex flex-row">
                    <div className="text-sm text-slate-400 max-w-[70%] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    
                    {user.status}
                    
                    </div>
                    <div className="flex ml-auto self-end text-sm text-slate-500">
                        7:00 PM
                    </div>
                </div>
            </div>
        </div>
    )
}
