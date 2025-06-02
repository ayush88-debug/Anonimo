'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { verifySchema } from "@/schemas/verifySchema";
import { apiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import {useParams, useRouter } from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";


export default function VerifyPage() {

    const router= useRouter()
    const params= useParams<{username:string}>()
     const [isSubmitting, setIsSubmitting]= useState(false)

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

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues:{
            code:""
        }
    })

    const onSubmit= async (data: z.infer<typeof verifySchema>)=>{
        setIsSubmitting(true)

        try {
            const response = await axios.post<apiResponse>("/api/verify", {
                username:params.username,
                code: data.code
            })
            notifySuccess(response.data.message)
            router.replace(`/sign-in`)
        } catch (err) {

            const axiosError= err as AxiosError<apiResponse>
            console.log("Error in verifying code:", axiosError.response?.data.message)

            notifyError(axiosError.response?.data.message || "Error in verifying code")
            
        }finally{
            setIsSubmitting(false)
        }

    }

return (
  <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white px-4">
    <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
      <div className="text-center space-y-2"> 
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Verify Your Account
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Enter the verification code sent to your email <br />
          <span className="text-sm text-gray-500">
            The code is valid for 1 hour.
          </span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Verification Code Input */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="justify-center">
                  <FormLabel className="text-gray-300 justify-center">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Verifying
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </Form>
    </div>
  </div>
);

}