"use client";

import MessageCard from "@/components/MessageCard/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { apiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Copy, RefreshCw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import {  useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const notifyError = (message: string) =>
    toast.error(message, {
      position: "bottom-right",
      theme: "colored",
      closeOnClick: true,
      pauseOnHover: true,
    });
  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: "bottom-right",
      theme: "colored",
      closeOnClick: true,
      pauseOnHover: true,
    });

    // Memoize the callback to avoid re-creating it on every render
    const handleDeleteMessage = useCallback( async(messageId: string)=>{
      setMessages( messages.filter((message)=> message._id !== messageId));
    },[messages])

    const {data : session}= useSession()

    const form = useForm({
      resolver: zodResolver(acceptMessageSchema)
    })

    const {register, watch, setValue} = form
    const acceptMessages= watch('acceptMessages')

    const fetchAcceptMessages = useCallback(async ()=>{
      setIsSwitchLoading(true);
      try {
        const response= await axios.get<apiResponse>('/api/accept-messages')
        setValue('acceptMessages', response.data.isAcceptingMessages ?? false)
      } catch (err) {
        const axiosError = err as AxiosError<apiResponse>

        notifyError(axiosError.response?.data.message || "Failed to fetch message settings")
        
      }finally{
        setIsSwitchLoading(false);
      }
    },[setValue])

    const fetchMessages= useCallback
      (async(refresh: boolean = false)=>{
        setIsLoading(true)
        setIsSwitchLoading(true)

        try {
          const response = await axios.get<apiResponse>('/api/get-messages');
          setMessages(response.data.messages || [])

          if(refresh){
            notifySuccess("Refreshed Messages")
          }
        } catch (err) {
          const axiosError = err as AxiosError<apiResponse>

          notifyError(axiosError.response?.data.message || "Failed to fetch messages")
        }finally{
          setIsLoading(false)
          setIsSwitchLoading(false)
        }

    },[setIsLoading, setIsSwitchLoading ])


    useEffect(()=>{
      if(!session || !session?.user) return

      fetchMessages()
      fetchAcceptMessages()
    },[session, fetchAcceptMessages, fetchMessages])


    const handleSwitchChange= async()=>{
      try {
        const response= await axios.post<apiResponse>('/api/accept-messages', {acceptMessges:!acceptMessages})
        setValue('acceptMessages', !acceptMessages)
        
        notifySuccess(response.data.message || "successfully Updated accept message status")
      } catch (err) {
        const axiosError= err as AxiosError<apiResponse>
        notifyError(axiosError.response?.data.message || "Error in Updating accept messages status")
      }
    }

      if (!session || !session.user) {
      return <div>Not Authorized</div>;
    }

    const {username} = session.user as User

    const baseURL= `${window.location.protocol}//${window.location.hostname}`
    const profileURL= `${baseURL}/u/${username}`

    const copyToClipBoard= ()=>{
      navigator.clipboard.writeText(profileURL)
      notifySuccess("Profile URL has been copied");
    }


   return (
  <div className="min-h-screen bg-gray-950 text-white px-4 pt-24 pb-8"> {/* added pt-24 for navbar offset */}
    <div className="max-w-5xl mx-auto space-y-6"> {/* increased width */}

      {/* URL + Switch Combined Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 gap-x-4">
        {/* Profile URL section */}
        <div className="flex-1 space-y-1">
          <Label className="text-gray-300 text-sm">Share Your Profile URL</Label>
          <div className="flex items-center gap-2 md:w-1/2">
            <Input
              value={profileURL}
              readOnly
              className="text-white bg-gray-900 border border-gray-700 text-sm px-3 py-2"
            />
            <Button
              onClick={copyToClipBoard}
              variant="secondary"
              className="text-sm px-3 py-2 cursor-pointer"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </div>

        {/* Switch */}
        <div className="flex items-center gap-2 pt-2 md:pt-0">
          <Label className="text-gray-300 text-sm">Accepting Messages</Label>
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="dark"
          />
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          size="sm"
          variant="secondary"
          className="text-sm px-3 py-2 cursor-pointer"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          Refresh
        </Button>
      </div>

      {/* Message list */}
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index} 
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No messages to display.</p>
        )}
      </div>
    </div>
  </div>
);
}

export default Dashboard;
