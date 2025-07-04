"use client"

import { useState } from "react"
import HomeCard from "./HomeCard"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { toast } from "sonner"

const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<"isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined>()
    const [value, setValue] = useState({
        dateTime: new Date(),
        description: "",
        link: ""
    })
    const [callDetails, setCallDetails] = useState<Call>()
    const { user } = useUser()
    const client = useStreamVideoClient()
    const callType = "default"

    const createMeeting = async () => {
        if (!client || !user) return
        try {
            if (!value.dateTime) {
                toast("Please select a date and time.")
            }
            const Id = crypto.randomUUID()
            const call = client.call(callType, Id)   /// Doubt
            if (!call) throw new Error("Failed to create call")
            const startsAt = value.dateTime.toISOString() || new Date(Date.now()).toISOString()
            const description = value.description || "Instant Meeting"
            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })
            setCallDetails(call)
            if (!value.description) {
                router.push(`/meeting/${call.id}`)
            }
            toast("Meeting Created.")
        } catch (error) {
            console.log(error)
            toast("Failed to create meeting")
        }
    }
    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard
                img="/icons/add-meeting.svg"
                title="New Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeetingState("isInstantMeeting")}
                className="bg-orange-1"
            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Schedule Meeting"
                description="Plan your meeting"
                handleClick={() => setMeetingState("isScheduleMeeting")}
                className="bg-blue-1"
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="View recordings"
                description="Checkout your recordings"
                handleClick={() => router.push("/recordings")}
                className="bg-purple-1"
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="Via invitation link"
                handleClick={() => setMeetingState("isJoiningMeeting")}
                className="bg-yellow-1"
            />
            <MeetingModal
                isOpen={meetingState === "isInstantMeeting"}
                onClose={() => setMeetingState(undefined)}
                title="Start an instant meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
        </section>
    )
}

export default MeetingTypeList
