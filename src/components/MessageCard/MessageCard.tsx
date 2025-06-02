'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Message } from '@/model/User'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'
import dayjs from "dayjs"

type MessageCardProp= {
    message: Message,
    onMessageDelete: (messageId: string)=> string
}

export default function MessageCard({message, onMessageDelete}: MessageCardProp) {

    const notifyError = (message:string) => toast.error(message, {
            position: "bottom-right",
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
        });
        const notifySuccess = (message:string) => toast.success(message,{
            position: "bottom-right",
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
        });

    const handleDeleteConfirm= async()=>{
        try {
            const response= await axios.delete<apiResponse>(`/api/delete-message/${message._id}`)

            notifySuccess(response.data.message)
            onMessageDelete(message._id as string)

        } catch (err) {
            const axiosError= err as AxiosError<apiResponse>
            notifyError(axiosError.response?.data.message ?? 'Failed to delete message')
        }
    }
   return (
    <Card className="w-full max-w-sm">
      <CardHeader className='flex flex-col'>
        <CardTitle>{message.content}</CardTitle>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
        <AlertDialog>
        <AlertDialogTrigger asChild>
             <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                Message.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
      <CardContent></CardContent>
    </Card>
  )
}