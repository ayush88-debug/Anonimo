'use client'

import { signOut, useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  console.log("Session:", session);
  console.log("Status:", status);

  if (status === "loading") {
    return <div className="text-white">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="text-red-500">You are not logged in</div>;
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
