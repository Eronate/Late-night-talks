import getCurrentSession from "@/app/utils/getCurrentSession"
import { NextApiRequest, NextApiResponse } from "next"

export async function GET(req: Request){
    const session = await getCurrentSession()
    const otherUsers = await prisma?.user.findMany({
        where: {
            email: {
                not: session?.user?.email
            }
        }
    })
    return Response.json(otherUsers)
}