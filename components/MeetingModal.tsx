import { ReactNode } from "react"

interface MeetingModelProps {
    isOpen: boolean
    onClose: () => void
    title: string
    className?: string
    children?: ReactNode
    handleClick?: () => void
    buttonText?: string
    image?: string
    buttonIcon?: string
}

const MeetingModal = ({ isOpen, onClose, title, className, buttonText, handleClick, children, image, buttonIcon }: MeetingModelProps) => {
    return (
        <div>

        </div>
    )
}

export default MeetingModal
