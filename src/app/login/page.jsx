'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    success ? (toast.success('Login successful!'), router.push('/dashboard'))
            : toast.error('Invalid credentials');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* Top Bar */}
      <div className="py-4 text-center font-semibold text-gray-700">
        Akij Resource
      </div>

      {/* Center Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
          
          <h2 className="text-center text-xl font-semibold mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="text-sm text-gray-600">Email / User ID</label>
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Enter your email/User ID"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="text-right text-sm">
              <a href="#" className="text-gray-500 hover:text-purple-600">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md text-white font-medium 
              bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#1a0933] text-white text-sm py-4">
        <div className="max-w-5xl mx-auto flex justify-between px-4">
          <p>Powered by AKIJ RESOURCE</p>
          <p>Helpline: +88 011020202505 | support@akij.work</p>
        </div>
      </div>
    </div>
  );
}