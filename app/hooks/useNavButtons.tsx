"use client"
import { useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { RiKakaoTalkLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { signOut } from "next-auth/react";
import { IconType } from "react-icons/lib";
import { useRouter } from "next/router";

export interface INavButton {
    path?: string,
    icon: React.ReactNode,
    onClick?: () => void
}

const useNavButtons = () => {
    const [routes, ] = useState<INavButton[]>([
        {
            path: '/conversations',
            icon: <RiKakaoTalkLine className="w-8 h-8"/>,
        },
        {
            path: '/users',
            icon: <FaUsers className="w-8 h-8"/>,
        },
        {
            onClick: () => signOut(),
            icon: <BiLogOut className="w-8 h-8"/>
        }
    ])
    return routes
}

export default useNavButtons