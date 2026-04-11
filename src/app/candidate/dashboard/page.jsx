'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CandidateDashboard() {
  const router = useRouter();
  const [candidateName, setCandidateName] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const email = localStorage.getItem('candidateEmail');
    if (!email) {
      router.push('/candidate/login');
    }
    setCandidateName(localStorage.getItem('candidateName') || 'Candidate');
  }, [router]);

  // mock exams with more display fields
  const exams = [
    {
      id: 1,
      title: 'Psychometric Test for Management Trainee Officer',
      duration: 30,
      questions: 20,
      negativeMarking: -0.25,
      totalMarks: 100,
      questionSets: 3,
      totalCandidates: 10000
    },
    {
      id: 2,
      title: 'Psychometric Test for Management Trainee Officer',
      duration: 30,
      questions: 20,
      negativeMarking: -0.25,
      totalMarks: 100,
      questionSets: 3,
      totalCandidates: 10000
    },
    {
      id: 3,
      title: 'Psychometric Test for Management Trainee Officer',
      duration: 30,
      questions: 20,
      negativeMarking: -0.25,
      totalMarks: 100,
      questionSets: null,
      totalCandidates: null
    },
    {
      id: 4,
      title: 'Psychometric Test for Management Trainee Officer',
      duration: 30,
      questions: 20,
      negativeMarking: -0.25,
      totalMarks: 100,
      questionSets: 3,
      totalCandidates: 10000
    }
  ];

  const filtered = exams.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const startExam = (exam) => {
    // attach mock questions if not present
    const examWithQuestions = {
      ...exam,
      questionsData: generateMockQuestions(exam.questions || 20),
    };
    localStorage.setItem('currentExam', JSON.stringify(examWithQuestions));
    router.push(`/candidate/exam/${exam.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-gray-800">AKJ RESOURCE</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white px-3 py-1 rounded">
              <img src="/logo.png" alt="User" className="w-8 h-8 rounded-full object-cover" />
              <div className="text-left">
                <div className="text-sm font-medium">{candidateName || 'Candidate'}</div>
                <div className="text-xs text-gray-500">Ref. ID - 1234341</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto px-4 pt-24 pb-8 w-full">
        {/* Toolbar below header: centered wide search input */}
        <div className="mb-6 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search tests" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Online Tests</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paged.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-md mb-3 text-gray-800">{exam.title}</h3>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">⏱</span>
                  <span>Duration: {exam.duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🧾</span>
                  <span>Question: {exam.questions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">⚠️</span>
                  <span>Negative Marking: {exam.negativeMarking}/wrong</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <div>Candidates: {exam.totalCandidates?.toLocaleString() || 'Not Set'}</div>
                  <div>Question Set: {exam.questionSets || 'Not Set'}</div>
                </div>
                <div>
                  <Button onClick={() => startExam(exam)} variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                    Start
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3">&lt;</Button>
            <div className="px-3 py-1 bg-white border rounded">{page}</div>
            <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3">&gt;</Button>
          </div>
          <div className="text-sm text-gray-600">Online Test Per Page
            <select value={pageSize} disabled className="ml-2 bg-white border rounded px-2 py-1 text-sm">
              <option>6</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a0933] text-white text-sm py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
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

function generateMockQuestions(count) {
  const samples = [
    {
      text: 'Which of the following indicators is used to measure market volatility?',
      options: ['Relative Strength Index (RSI)', 'Moving Average Convergence Divergence (MACD)', 'Bollinger Bands', 'Fibonacci Retracement'],
      correct: 2
    },
    {
      text: 'What does CPU stand for?',
      options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Utility'],
      correct: 0
    },
    {
      text: 'Which of the following is a programming language?',
      options: ['HTML', 'CSS', 'JavaScript', 'XML'],
      correct: 2
    },
    {
      text: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct: 2
    }
  ];

  const result = [];
  for (let i = 0; i < count; i++) {
    result.push({ id: i + 1, ...samples[i % samples.length] });
  }
  return result;
}