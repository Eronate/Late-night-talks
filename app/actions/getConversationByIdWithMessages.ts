import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { FullConversationType } from "../types";

const getConversationByIdWithMessages = async (
  id: string
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: id
      },
      include: {
        users: true,
        messages: {
            include: {
                sender: true,
                seen: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        }
      }
    });

    return conversation;
  } catch (error: any) {
    return null;
  }
};

export default getConversationByIdWithMessages;