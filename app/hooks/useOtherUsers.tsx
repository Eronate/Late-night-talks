import { useSession } from "next-auth/react"
import prisma from "@/app/libs/prismadb"
import axios from "axios"
import { useEffect, useState } from "react"
import { User } from "@prisma/client"

export default function useOtherUsers() {
    const { data: session } = useSession()
    const [otherUsers, setOtherUsers] = useState<User[] | null>(null)
    
    useEffect(() => {
        if(!session?.user)
            return

        const fetchOtherUsers = async () => {
            const users = await axios.get('/api/users/other')
            setOtherUsers(users.data)
        }
        fetchOtherUsers()
    }, [session?.user]);
    
    return otherUsers
}
