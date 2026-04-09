'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useExamStore from '@/store/examStore';
import toast from 'react-hot-toast';

export default function CreateTestPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addExam = useExamStore((state) => state.addExam);
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState(null);
  const [questions, setQuestions] = useState([]);

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleBasicInfoSubmit = (data) => {
    setBasicInfo(data);
    setStep(2);
  };

  const handleAddQuestion = () => {
    const question = {
      id: Date.now().toString(),
      title: 'Sample Question',
      type: 'radio',
      score: 1,
      options: ['Option A', 'Option B']
    };
    setQuestions([...questions, question]);
    toast.success('Question added!');
  };

  const handleSaveExam = () => {
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    
    const exam = {
      ...basicInfo,
      questions,
      createdAt: new Date().toISOString(),
    };
    
    addExam(exam);
    toast.success('Exam created successfully!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="flex gap-4 border-b">
              <button
                onClick={() => setStep(1)}
                className={`pb-2 px-4 ${step === 1 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                1. Basic Info
              </button>
              <button
                className={`pb-2 px-4 ${step === 2 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                2. Questions
              </button>
            </div>
          </div>
          
          {step === 1 && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleBasicInfoSubmit({
                title: formData.get('title'),
                totalCandidates: formData.get('totalCandidates'),
                totalSlots: formData.get('totalSlots'),
                questionSets: formData.get('questionSets'),
                questionType: formData.get('questionType'),
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                duration: formData.get('duration'),
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Online Test Title *</label>
                <input name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Candidates *</label>
                  <input name="totalCandidates" type="number" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots *</label>
                  <input name="totalSlots" type="number" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Sets *</label>
                  <input name="questionSets" type="number" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                  <select name="questionType" className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>MCQ</option>
                    <option>Mixed</option>
                    <option>Descriptive</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input name="startTime" type="datetime-local" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input name="endTime" type="datetime-local" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes) *</label>
                <input name="duration" type="number" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              
              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Save & Continue
                </button>
              </div>
            </form>
          )}
          
          {step === 2 && basicInfo && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Questions ({questions.length})</h3>
                <button onClick={handleAddQuestion} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  + Add Question
                </button>
              </div>
              
              {questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No questions added yet. Click "Add Question" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={q.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">Question {index + 1}: {q.title}</h4>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between mt-6 pt-4 border-t">
                <button onClick={() => setStep(1)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">
                  Back
                </button>
                <button onClick={handleSaveExam} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                  Create Exam
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}