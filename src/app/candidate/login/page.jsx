'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CandidateLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Candidate credentials (use NEXT_PUBLIC_ env vars to override in development)
  const CANDIDATE_EMAIL = process.env.NEXT_PUBLIC_CANDIDATE_EMAIL || 'candidate@example.com';
  const CANDIDATE_PASSWORD = process.env.NEXT_PUBLIC_CANDIDATE_PASSWORD || 'candidate123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate against configured candidate credentials
    if (!email || !password) {
      toast.error('Please enter email and password');
      setLoading(false);
      return;
    }

    if (email === CANDIDATE_EMAIL && password === CANDIDATE_PASSWORD) {
      localStorage.setItem('candidateEmail', email);
      localStorage.setItem('candidateName', 'Md. Naimur Rahman');
      toast.success('Login successful!');
      router.push('/candidate/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Fixed Header */}
      <div className="w-full bg-white shadow-sm py-3 fixed top-0 left-0 z-50">
        <div className="relative max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="font-semibold text-gray-700 text-lg">Akij Resource</span>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
          <h2 className="text-center text-xl font-semibold mb-6">Candidate Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600">Email / User ID</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email/User ID"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md text-white font-medium bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 transition-opacity"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a0933] text-white text-sm py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
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