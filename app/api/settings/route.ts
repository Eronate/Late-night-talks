import { prismadb } from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(req: Request)
{
    try{
    const body = await req.json()
    const { image, username, id } = body as {image: string, username: string, id: string}
    if(!image || !username || !id)
        return NextResponse.json({error: 'Image or username not provided'}, {status: 400})
    const user = await prismadb.user.update({
        where: {
            id: id
        },
        data: {
            image: image,
            username: username
        }
    })
    return NextResponse.json(user)
    }
    catch(err)
    {
        console.log(err)
        return NextResponse.json({error: 'Could not be updated'}, {status: 400})
    }
}