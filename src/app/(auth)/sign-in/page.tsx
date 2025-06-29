'use client';

import { useState } from 'react'
import toast from 'react-hot-toast';
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import {Loader2} from "lucide-react"
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';


export default function SignUpForm() {

    const [isSubmitting, setIsSubmitting]= useState(false)

    const notifyError = (message: string) =>(
      toast.error(message))

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email:"",
            password:""
        },
    })

    const onSubmit = async( data: z.infer<typeof signInSchema>)=>{
        setIsSubmitting(true)
        try {
            const result= await signIn("credentials", {
                redirect: false,
                callbackUrl: "/dashboard",
                email:data.email,
                password: data.password
            })

            if (result?.error) {
                notifyError(result?.error || "Login Failed")
            }
            if (result?.url) {
              setIsSubmitting(false)
              window.location.href = result.url;
            }
        }finally{
            setIsSubmitting(false)
        }
    }
return (
  <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white px-4">
    <div className="w-full max-w-md p-6 space-y-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Join Anonimo</h1>
        <p className="text-gray-400 text-sm">Login to start your anonymous adventure</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">

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
                    <div>
                      <Input
                        type="password"
                        className="bg-gray-800 border border-none mask-auto border-gray-700 text-white placeholder-gray-500"
                        placeholder="Password"
                        {...field}
                      />
                      <div>
                        <div 
                        className='underline pt-2 hover:text-indigo-400 cursor-pointer' 
                        // href={"/password-change"}
                        onClick={()=> notifyError("password bhoolne ka feature chahiye? Hum bhi bhool gaye banana 😂, Thoda intezaar karo!")}
                        >Forgot Password?</div>
                      </div>
                    </div>
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
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          {`Don't have an account?   `}
          <Link href="/sign-up" className="text-indigo-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  </div>
);

}
