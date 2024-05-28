import { Conversation, Message, User} from "@prisma/client"

export type MeaningfulUserFields = 
    Pick<User, 
    "id" | 
    "username" | 
    "email" | 
    "image" | 
    "createdAt" | 
    "updatedAt" |
    "status">

export type FullMessageType = Message & {
    sender: MeaningfulUserFields,
    seen: MeaningfulUserFields[]
}

export type FullConversationType = Conversation & {
    users: MeaningfulUserFields[],
    messages: FullMessageType[]
}

export const getMeaningfulUserFields = (user: User): MeaningfulUserFields => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        status: user.status
    }
}