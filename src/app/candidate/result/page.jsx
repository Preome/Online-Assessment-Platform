'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [candidateName, setCandidateName] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('candidateEmail');
    if (!email) {
      router.push('/candidate/login');
    }
    setCandidateName(localStorage.getItem('candidateName') || 'Candidate');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4">Akij Resource</h2>
          <p className="text-gray-600 mb-6">
            Dear {candidateName}, Thank you for completing the exam. Your results will be announced soon.
          </p>
          <button
            onClick={() => router.push('/candidate/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="bg-[#1a0933] text-white text-sm py-4">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-5 h-5" />
            <span>Powered by AKJ RESOURCE</span>
          </div>
          <div className="flex gap-4">
            <span>Helpline: +88 011020202505</span>
            <span>support@akj.work</span>
          </div>
        </div>
      </div>
    </div>
  );
}