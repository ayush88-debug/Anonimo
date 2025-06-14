'use client'

import { BackgroundBeams } from '@/components/ui/background-beams'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { messageSchema } from '@/schemas/messageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCw } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { z } from 'zod'

function SenderPage() {
  const params = useParams<{ username: string }>()
  const [demoMessages, setDemoMessages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const notifyError = (message: string) =>(
    toast.error(message))
    
  const notifySuccess = (message: string) =>(
    toast.success(message))

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ''
    }
  })

  const {setValue} = form

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<apiResponse>('/api/send-message', {
        username: params.username,
        content: data.content
      })
      notifySuccess(response.data.message)
    } catch (err) {
      const axiosError = err as AxiosError<apiResponse>
      notifyError(axiosError.response?.data.message || 'Error Sending Message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchDemoMessages = useCallback(async (refresh: boolean = false) => {
    setIsRefreshing(true)
    try {
      const response = await axios.get<apiResponse>('/api/suggest-messages')
      console.log(response.data.fullText)
      if (response.data.fullText) {
        const suggestions = response.data.fullText.split('||').map((msg:string) => msg.trim()).filter(Boolean)
        setDemoMessages(suggestions)
      }
      if (refresh) {
        notifySuccess('Refreshed suggestions')
      }
    } catch (err) {
      const axiosError = err as AxiosError<apiResponse>
      notifyError(axiosError.response?.data.message || 'Failed to fetch suggestions')
    } finally {
      setIsRefreshing(false)
    }
  }, [setIsRefreshing])

  useEffect(() => {
    fetchDemoMessages()
  }, [fetchDemoMessages])

  return (
    <div className='min-h-screen bg-gray-950 text-white px-4 pt-24 pb-12'>
      <div className='max-w-3xl mx-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-lg font-semibold z-10'>Send anonymous message to <span className='text-indigo-400'>{params.username}</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Write your honest thoughts...'
                      className='resize-none bg-gray-900 border-2 border-gray-700 text-white min-h-32 z-10'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-center">
                <Button 
                disabled={isSubmitting}
                type='submit' className='bg-indigo-600 hover:bg-indigo-700 min-w-1/2 z-10 cursor-pointer'>
                {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Sending
              </>
            ) : (
              "Send"
            )}
            </Button>
            </div>
          </form>
        </Form>

        <Separator className='my-12 bg-gray-700 z-10' />

        {/* Refresh Button */}
      <div className="flex justify-end pb-5">
        <Button
          onClick={(e) => {
            e.preventDefault();
            fetchDemoMessages(true);
          }}
          size="sm"
          variant="secondary"
          className="text-sm px-3 py-2 cursor-pointer z-10"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          Refresh
        </Button>
      </div>

        <div>
          <h2 className='text-2xl font-bold mb-4 text-center z-10'>Suggested Messages</h2>
          <div className='grid gap-4 sm:grid-cols-2'>
            {demoMessages.length === 0 ? (
              <p className='text-gray-400 text-center col-span-full z-10'>No suggestions yet. Please try again later.</p>
            ) : (
              demoMessages.map((msg, idx) => (
                <div key={idx}
                onClick={() => setValue('content', msg )} 
                className='bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-gray-300 shadow-md cursor-pointer z-10'>
                  {msg}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  )
}

export default SenderPage
