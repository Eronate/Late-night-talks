
"use client"
import { Fragment, forwardRef, useImperativeHandle, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface IModalProps {
    title?: string,
    description?: string
    children?: React.ReactNode[] | React.ReactNode,
}

export interface ToggleOpenType {
    toggleOpen: () => void
}

const Modal = forwardRef(function Modal(props: IModalProps, ref) {
    const [isOpen, setIsOpen] = useState(false)
    const { title, description, children } = {...props}
    // useImperativeHandle(ref, () => {
    //     return {
    //       toggleOpen() {
    //         setIsOpen(!isOpen)
    //       },
    //     };
    //   }, [isOpen]);

    return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    )
    
})

export default Modal