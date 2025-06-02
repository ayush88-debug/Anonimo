'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <Loader2 className='animate-spin'/>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-red-500">
        You are not logged in
        <Button onClick={()=> signOut()}></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <h1 className="text-2xl font-semibold">
        Welcome, {session?.user?.username || session?.user?.email}
      </h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
