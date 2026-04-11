'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Always send users to the login page by default
  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null;
}