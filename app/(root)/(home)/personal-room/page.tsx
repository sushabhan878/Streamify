"use client"


import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useGetCallById } from '@/hooks/useGetCallById'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'

const Table = ({ title, description, copyable = false }: { title: string, description: string, copyable?: boolean }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(description)
    toast.success("Link copied to clipboard!")
  }

  return (
    <div className='flex flex-col items-start gap-2 xl:flex-row'>
      <h1 className='text-base font-medium text-sky-300 lg:text-xl xl:min-w-32'>{title}:</h1>
      <div className='flex items-center gap-2 w-full'>
        <h1 className='text-sm font-medium max-sm:max-w-[320px] lg:text-xl truncate'>{description}</h1>
        {copyable && (
          <button
            onClick={handleCopy}
            className='hover:text-sky-300 transition-colors'
            aria-label='Copy link'
          >
            <Copy size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

const PersonalRoom = () => {
  const { user } = useUser()
  const meetingId = user?.id
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`
  const client = useStreamVideoClient()
  const { call } = useGetCallById(meetingId!)
  const router = useRouter()
  const startMeetingRoom = async () => {
    if (!client || !user) return

    if (!call) {
      const newCall = client.call("default", meetingId!)
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString()
        }
      })
    }
    router.push(`/meeting/${meetingId}?personal=true`)
  }
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>Personal Room</h1>
      <div className='flex w-full flex-col gap-8 xl:max-w-[900spx]'>
        <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invitation Link" description={meetingLink} copyable />
      </div>
      <div className='flex gap-5'>
        <Button className='bg-blue-1' onClick={startMeetingRoom}>
          Start Meeting
        </Button>
        <Button className='bg-dark-3 ' onClick={() => {
          navigator.clipboard.writeText(meetingLink)
          toast("Link copied to clipboard!")
        }}>
          Copy Invitation
        </Button>
      </div>
    </section>
  )
}

export default PersonalRoom
