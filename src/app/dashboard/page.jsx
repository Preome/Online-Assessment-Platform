'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useExamStore from '@/store/examStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function DashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const exams = useExamStore((state) => state.exams);
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const filtered = useMemo(() => {
    if (!query) return exams;
    return exams.filter((e) => e.title?.toLowerCase().includes(query.toLowerCase()));
  }, [exams, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Akij Resource Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-bold text-gray-800">AKIJ RESOURCE</h1>
          </div>
          <div className="flex items-center gap-4">
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by exam title"
            />
            <Button
              onClick={() => router.push('/create-test')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create Online Test
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Online Tests</h2>

        {exams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mb-6">
              <img src="/empty-state.png" alt="No tests available" className="w-64 h-64 mx-auto object-contain" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Online Test Available</h3>
            <p className="text-gray-500">Currently, there are no online tests available. Please check back later for updates.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((exam) => (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg mb-2">{exam.title}</h3>
                    <div className="text-sm text-gray-500">ID: {exam.id}</div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">👥</span>
                      <span>Candidates: {exam.totalCandidates?.toLocaleString() || 'Not Set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📄</span>
                      <span>Question Set: {exam.questionSets || 'Not Set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">⏱</span>
                      <span>Exam Slots: {exam.totalSlots || 'Not Set'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Button
                      onClick={() => alert('View Candidates - Coming Soon')}
                      variant="outline"
                      className="w-full text-purple-600 border-purple-300 hover:bg-purple-50"
                    >
                      View Candidates
                    </Button>
                    <Button
                      onClick={() => router.push(`/manage-test/${exam.id}`)}
                      className="w-full bg-purple-600 hover:bg-purple-700 mt-2"
                    >
                      Manage Test
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">Showing {filtered.length} result(s)</div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1">Prev</Button>
                <div className="px-3 py-1 bg-white border rounded">{page} / {totalPages}</div>
                <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1">Next</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}