"use client"
import useOtherUsers from "@/app/hooks/useOtherUsers"
import UserBox from "./UserBox"
import UtilityBox from "./friends/UtilityBox"

export default function UsersList() {
    const users = useOtherUsers()
    if(!users)
        return <></>
    return (
        <div className="flex min-w-full sm:min-w-96 h-full bg-navycustom flex-col">
            <UtilityBox />
            {users.map((u,index) => 
                <UserBox key={index} user={u}/>
            )}
        </div>
    )
}
