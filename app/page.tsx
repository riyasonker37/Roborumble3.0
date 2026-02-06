"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "./components/Loading";
import Hero from "./components/Hero";

export default function Home() {
  const [phase, setPhase] = useState<'loading' | 'intro'>('loading');
  const router = useRouter();

  useEffect(() => {
    // Phase 1: Loading Screen (3 seconds)
    if (phase === 'loading') {
      const timer = setTimeout(() => {
        setPhase('intro');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {phase === 'loading' && <Loading />}

      {phase === 'intro' && (
        <>
          {/* Matrix Background (Red/Granting Access) */}
          <Hero onComplete={() => router.push('/home')} />
        </>
      )}
    </main>
  );
}
