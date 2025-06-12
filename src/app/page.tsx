'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { motion } from "framer-motion";
import Autoplay from 'embla-carousel-autoplay'
import Link from "next/link";
import { GithubIcon } from "lucide-react";
import { LampContainer } from "@/components/ui/lamp";

export default function LandingPage() {
const demoMessages = [
  {
    title: "Hidden Confession",
    content: "What's something you've never told anyone, but always wanted to?"
  },
  {
    title: "Quirky Prompt",
    content: "If animals could talk, which species would be the rudest of them all?"
  },
  {
    title: "Deep Thought",
    content: "If you could send a message to your 10-year-old self, what would it say?"
  },
  {
    title: "Just Wondering",
    content: "What’s a lie you’ve told that you’re oddly proud of?"
  },
  {
    title: "Funny Ask",
    content: "Would you rather fight one horse-sized duck or a hundred duck-sized horses?"
  },
  {
    title: "Philosophical Curiosity",
    content: "What do you think happens in the seconds after we die?"
  }
];


  const features = [
    {
      title: "Send Anonymously",
      description: "Let others send you messages without revealing their identity."
    },
    {
      title: "Message Suggestions",
      description: "Get quirky, funny, and thoughtful message ideas to spark more interactions."
    },
    {
      title: "Simple Dashboard",
      description: "Your messages in one clean, beautiful interface."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b bg-slate-950 text-white py-12 font-sans">
     
        {/* Lamp */}
        <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="text-center space-y-8"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight pt-16">
            Share Thoughts <br className="hidden md:inline" />
            <span className="text-indigo-500">Without Revealing Identity</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Anonimo lets anyone send you anonymous messages. No signups. No pressure. Just honest thoughts.
          </p>
          <div className="flex justify-center gap-6">
            <Link href={"/dashboard"}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer">Try Anonimo</Button>
            </Link>
            <Link href={"https://github.com/ayush88-debug/Anonimo"}>
              <Button variant="secondary" className="cursor-pointer"><GithubIcon/><span>GitHub</span></Button>
            </Link>
          </div>
        </motion.div>
      </LampContainer>

      <div className="max-w-6xl mx-auto">

        {/* Features Section */}
        <motion.section
          className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-6 px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-900 border border-gray-800 rounded-2xl shadow-md h-full flex flex-col">
                <CardHeader className="flex-grow">
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-sm">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="h-0" />
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* Demo Messages Carousel */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Anonymous Messages</h2>
          <Carousel className="w-2/3 mx-auto" plugins={[Autoplay({ delay: 2500 })]}>
            <CarouselContent>
              {demoMessages.map((msg, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-gray-900 border border-gray-800 rounded-xl shadow-md">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{msg.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm">{msg.content}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center items-center mt-4 gap-4">
              <CarouselPrevious className="dark bg-gray-800" />
              <CarouselNext className="dark bg-gray-800" />
            </div>
          </Carousel>
        </motion.section>

        {/* Footer */}
        <footer className="text-center mt-16 border-t border-gray-800 pt-6 text-gray-500 text-sm">
          © 2025 Anonimo. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
