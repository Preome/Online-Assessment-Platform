'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidateDashboard() {
  const router = useRouter();
  const [candidateName, setCandidateName] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('candidateEmail');
    if (!email) {
      router.push('/candidate/login');
    }
    setCandidateName(localStorage.getItem('candidateName') || 'Candidate');
  }, [router]);

  const exams = [
    {
      id: 1,
      title: "Psychometric Test for Management Trainee Officer",
      duration: 30,
      questions: 20,
      negativeMarking: -0.25,
      totalMarks: 100
    },
    {
      id: 2,
      title: "Technical Assessment for Software Engineer",
      duration: 45,
      questions: 30,
      negativeMarking: -0.5,
      totalMarks: 150
    },
    {
      id: 3,
      title: "English Proficiency Test",
      duration: 25,
      questions: 15,
      negativeMarking: -0.25,
      totalMarks: 75
    }
  ];

  const startExam = (exam) => {
    localStorage.setItem('currentExam', JSON.stringify(exam));
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
          <div className="text-sm text-gray-600">
            Welcome, {candidateName}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto px-4 pt-24 pb-8 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Online Tests</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-md mb-3 text-gray-800">{exam.title}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>Duration: {exam.duration} min</p>
                <p>Question: {exam.questions}</p>
                <p>Negative Marking: {exam.negativeMarking}/wrong</p>
              </div>
              <button
                onClick={() => startExam(exam)}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Exam
              </button>
            </div>
          ))}
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