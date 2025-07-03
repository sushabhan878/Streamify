"use server"

import { currentUser } from "@clerk/nextjs/server"
import { StreamClient } from "@stream-io/node-sdk"
import { UserRequest } from "@stream-io/video-react-sdk"

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
const apiSceret = process.env.STREAM_SECRET_KEY

export const tokenProvider = async () => {
    const user = await currentUser()
    if(!user) throw new Error("User is Not logged in")
    if(!apiKey) throw new Error("No API Key Available")
    if(!apiSceret) throw new Error("No API Sceret available")

    const client = new StreamClient(apiKey, apiSceret)
    const newUser: UserRequest = {
        id: user.id
    }
    await client.upsertUsers([newUser])
    const vailidity = 60 * 60;

    const token = client.generateUserToken({user_id: user.id, validity_in_seconds: vailidity})
    return token
}