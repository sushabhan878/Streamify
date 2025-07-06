"use client"


import { useGetCalls } from "@/hooks/useGetCalls"
import { useRouter } from "next/navigation"
import { Call, CallRecording } from "@stream-io/video-react-sdk"
import { useState } from "react"

import MeetingCard from "./MeetingCard"
import Loader from "./Loader"

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls()
    const router = useRouter()
    const [recordings, setRecordings] = useState<CallRecording[]>([])
    const getCalls = () => {
        switch (type) {
            case "ended":
                return endedCalls
            case "upcoming":
                return upcomingCalls
            case "recordings":
                return recordings
            default:
                return []
        }
    }
    const getNoCallMessage = () => {
        switch (type) {
            case "ended":
                return "No Previous Calls Found"
            case "upcoming":
                return "No Upcoming Calls Found"
            case "recordings":
                return "No Recordings Found"
            default:
                return ""
        }
    }
    const calls = getCalls()
    const noCallsMessage = getNoCallMessage()
    if (isLoading) return <Loader />
    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
                <MeetingCard
                    key={(meeting as Call)?.id}
                    icon={
                        type === "ended" ? "/icons/previous.svg"
                            : type === "upcoming" ? "/icons/upcoming.svg"
                                : "/icons/recordings.svg"
                    }
                    title={(meeting as Call).state.custom.description?.substring(0, 26) || "No Description"}
                    date={(meeting as Call).state.startsAt?.toLocaleString() || (meeting as CallRecording).start_time?.toLocaleString()}
                    isPreviousMeeting={type === "ended"}
                    buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
                    buttonText={type === "recordings" ? "Play" : "Start"}
                    handleClick={type === "recordings" ? () => router.push(`${(meeting as CallRecording).url}`) : () => router.push(`${(meeting as Call).id}`)}
                    link={type === "recordings" ? (meeting as CallRecording).url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`}
                />
            )) : (
                <h1>{noCallsMessage}</h1>
            )}
        </div>
    )
}

export default CallList
