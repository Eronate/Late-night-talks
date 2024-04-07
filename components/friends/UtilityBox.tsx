"use client"
import { IoPersonAddOutline } from "react-icons/io5";
import Modal, { ToggleOpenType } from "../TransitionModal";
import { useRef } from "react";

export default function UtilityBox() {
    const refToFriendsButton = useRef<ToggleOpenType>(null)
    return (
        <div className="flex flex-col w-full p-2 ">
            <div className="text-2xl p-2 text-slate-400">
                Friends list
            </div>
            <button className="text-sm p-2 transition-colors text-slate-400 shadow-sm rounded-full w-max ml-auto hover:bg-customcoolcolor">
                <div onClick={() => {
                if(refToFriendsButton.current)
                    refToFriendsButton.current.toggleOpen()
                }} className="w-max p-0">
                    <IoPersonAddOutline className="w-5 h-5"/>
                </div>
            </button>
        </div>
    )
}
