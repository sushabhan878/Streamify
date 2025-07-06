"use client"

import { useState } from "react"
import HomeCard from "./HomeCard"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { toast } from "sonner"
import { Textarea } from "./ui/textarea"
import { Input } from "@/components/ui/input"
import ReactDatePicker from "react-datepicker"

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
            const id = crypto.randomUUID()
            const call = client.call(callType, id)   /// Doubt
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
        } catch {
            toast("Failed to create meeting")
        }
    }
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
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
            {!callDetails ? (
                <MeetingModal
                    isOpen={meetingState === "isScheduleMeeting"}
                    onClose={() => setMeetingState(undefined)}
                    title="Create Meeting"
                    handleClick={createMeeting}
                >
                    <div className="flex flex-col gap-2.5">
                        <label className="text-base text-normal leading-[22px] text-sky-300">Add a description</label>
                        <Textarea className="border-none bg-sky-50 text-black opacity-80 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e) => {
                            setValue({ ...value, description: e.target.value })
                        }} />
                    </div>
                    <div className="flex w-full flex-col gap-2.5">
                        <label className="text-base text-normal leading-[22px] text-sky-300">Swlect Date and Time</label>
                        <ReactDatePicker className=" w-full rounded p-2 border-none bg-sky-50 text-black opacity-80 focus:outline-none" selected={value.dateTime} onChange={(date) => {
                            setValue({ ...value, dateTime: date! })
                        }}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa" />


                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal
                    isOpen={meetingState === "isScheduleMeeting"}
                    onClose={() => setMeetingState(undefined)}
                    title="Meeting Created"
                    className="text-center"
                    buttonIcon="/icons/copy.svg"
                    buttonText="Copy Meeting Link"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink)
                        toast("Link Copied Successfully")
                    }}
                    image="/icons/checked.svg"
                />
            )}
            <MeetingModal
                isOpen={meetingState === "isInstantMeeting"}
                onClose={() => setMeetingState(undefined)}
                title="Start an instant meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
            <MeetingModal
                isOpen={meetingState === "isJoiningMeeting"}
                onClose={() => setMeetingState(undefined)}
                title="Enter the link here"
                className="text-center"
                buttonText="Join Meeting"
                handleClick={() => router.push(value.link)}
            >
                <Input placeholder="Past the meeting link" className="border-none bg-sky-50 text-black opacity-80 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e) => setValue({ ...value, link: e.target.value })} />
            </MeetingModal>
        </section>
    )
}

export default MeetingTypeList
