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
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl text-center">
          <div className="flex flex-col items-center">
              <div className="mb-4">
              <div className="w-20 h-20 rounded-lg flex items-center justify-center" style={{ background: '#fff0ff', border: '4px solid #ff33cc' }}>
                <img src="/tick.png" alt="Test Completed" className="w-12 h-12" />
              </div>
            </div>

            <div className="mb-3">
              <span className="inline-block bg-green-100 border border-green-600 text-green-800 px-3 py-1 rounded font-semibold">Test Completed</span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">Congratulations!</h3>
            <p className="text-gray-600 mb-6 max-w-2xl">
              Dear {candidateName}, You have completed your MCQ Exam. Thank you for participating.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/candidate/dashboard')}
                className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push('/candidate/result')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View Result
              </button>
            </div>
          </div>
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