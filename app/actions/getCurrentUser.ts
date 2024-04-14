import axios from "axios"
import getCurrentSession from "../utils/getCurrentSession"
import { User } from "@prisma/client"
import { prismadb } from "../libs/prismadb"
export default async function getCurrentUser() {
    const session = await getCurrentSession()
    if(!session) return null
    const response = await prismadb.user.findFirst({
        where: {
            username: session.user.username
        }
    })
    if(!response) return null
    return response as User;
}
