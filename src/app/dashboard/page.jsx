'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useExamStore from '@/store/examStore';

export default function DashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const exams = useExamStore((state) => state.exams);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Akij Resource Logo" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-bold text-gray-800">AKIJ RESOURCE</h1>
          </div>
          <button 
            onClick={() => router.push('/create-test')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create New Test
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Online Tests</h1>
        
        {exams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            {/* Empty State Image */}
            <div className="mb-6">
              <img 
                src="/empty-state.png" 
                alt="No tests available" 
                className="w-64 h-64 mx-auto object-contain"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Online Test Available</h3>
            <p className="text-gray-500">Currently, there are no online tests available. Please check back later for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg mb-3">{exam.title}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>Candidates: {exam.totalCandidates?.toLocaleString() || 'Not Set'}</p>
                  <p>Question Sets: {exam.questionSets || 'Not Set'}</p>
                  <p>Exam Slots: {exam.totalSlots || 'Not Set'}</p>
                </div>
                <button 
                  className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => alert('View Candidates - Coming Soon')}
                >
                  View Candidates
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}