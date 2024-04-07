import { getServerSession } from "next-auth";
import authOptions from "../api/auth/authOptions";

export default async function getCurrentSession() {
    return await getServerSession(authOptions)
}