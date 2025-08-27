
"use client";
import { CodeTracker } from "@/components/CodeTracker";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Login from "./login/page";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  return <CodeTracker />;
}
