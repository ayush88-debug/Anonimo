'use client'
import React, { useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Message } from '@/model/User'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import toast from 'react-hot-toast';
import dayjs from "dayjs"
import { Loader2 } from 'lucide-react'

type MessageCardProp= {
    message: Message,
    onMessageDelete: (messageId: string)=> void
}

export default function MessageCard({message, onMessageDelete}: MessageCardProp) {

  const [isDeleting, setIsDeleting] = useState(false)

      const notifyError = (message: string) =>(
      toast.error(message))
      
      const notifySuccess = (message: string) =>(
      toast.success(message))

    const handleDeleteConfirm= async()=>{
      setIsDeleting(true)
        try {
            const response= await axios.delete<apiResponse>(`/api/delete-message?messageID=${message._id}`)

            notifySuccess(response.data.message)
            onMessageDelete(message._id as string)

        } catch (err) {
            const axiosError= err as AxiosError<apiResponse>
            notifyError(axiosError.response?.data.message ?? 'Failed to delete message')
        }finally{
          setIsDeleting(false)
        }
    }
    

  return (
<Card className="bg-gray-900 border border-gray-700 text-white shadow-md rounded-2xl transition hover:border-indigo-600 flex flex-col justify-between">
  <CardHeader>
      <CardTitle className='block text-base min-h-16 font-medium text-gray-100'>
        {message.content}
      </CardTitle>
  </CardHeader>

  <CardFooter className="flex items-center justify-between text-sm text-gray-400">
    <span>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</span>
    
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
        disabled={isDeleting}
        variant="ghost" className="text-red-500 hover:text-red-600 cursor-pointer">
          {isDeleting ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting
              </>
            ) : (
              "Delete"
            )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-950 border border-gray-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-400">
            This action cannot be undone. This will permanently delete this message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-900 dark cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 cursor-pointer">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardFooter>
</Card>

  )
}