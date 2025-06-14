'use client';

import { useEffect, useState } from 'react'
import { useDebounce } from 'hooks-ts';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signUpSchema } from '@/schemas/signUpSchema';
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { z } from "zod"
import axios, { AxiosError } from "axios"
import { apiResponse } from '@/types/apiResponse';
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import {Loader2} from "lucide-react"


export default function SignUpForm() {

    const [username, setUsername]= useState("")
    const [usernameMessage, setUsernameMessage]= useState("")
    const [isCheckingUsername, setUsernameChecking]= useState(false)
    const [isSubmitting, setIsSubmitting]= useState(false)
    const debouncedUsername = useDebounce(username, 500);

    const router = useRouter()
    
    const notifyError = (message: string) =>(
    toast.error(message))
    
    const notifySuccess = (message: string) =>(
    toast.success(message))


    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
        username: "",
        email:"",
        password:""
        },
    })

    useEffect(() => {
        const checkUsername = async () => {
            if(debouncedUsername){
                setUsernameChecking(true)
                setUsernameMessage("")
                try {
                    const response= await axios.get(`/api/check-unique-username?username=${debouncedUsername}`)
                    setUsernameMessage(response.data.message)
                   
                } catch (err) {
                    const axiosError= err as AxiosError<apiResponse>

                    setUsernameMessage(axiosError.response?.data.message || "Error Checking Username")
                    
                }finally{
                    setUsernameChecking(false)
                }

            }
        };
        checkUsername();
    }, [debouncedUsername]);

    const onSubmit = async( data: z.infer<typeof signUpSchema>)=>{
        setIsSubmitting(true)
        try {
            const response= await axios.post<apiResponse>('/api/sign-up', data)

            notifySuccess(response.data.message)
            router.replace(`/verify/${username}`)
            
        } catch (err) {

          const axiosError= err as AxiosError<apiResponse>
          console.log("Error during SignUp: ", axiosError.response?.data.message)

            const errorMessage= axiosError.response?.data.message || 'There was a problem with your sign-up. Please try again.'

            notifyError(errorMessage as string)
        }finally{
            setIsSubmitting(false)
        }
    }
return (
  <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
    <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Join Anonimo</h1>
        <p className="text-gray-400 text-sm">Sign up to start your anonymous adventure</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-800 border-none mask-auto border-gray-700 text-white placeholder-gray-500"
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin text-gray-400" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-800 border border-none mask-auto border-gray-700 text-white placeholder-gray-500"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-gray-400 text-sm">We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-gray-800 border border-none mask-auto border-gray-700 text-white placeholder-gray-500"
                      placeholder="Password"
                      {...field}
                    />
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
                Submitting
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-indigo-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
);

}
