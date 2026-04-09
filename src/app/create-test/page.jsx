'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useExamStore from '@/store/examStore';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import QuestionForm from '@/components/forms/QuestionForm';
import toast from 'react-hot-toast';

export default function CreateTestPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addExam = useExamStore((state) => state.addExam);
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleBasicInfoSubmit = (data) => {
    setBasicInfo(data);
    setStep(2);
    toast.success('Basic info saved! Now add questions.');
  };

  const handleAddQuestion = (question) => {
    if (editingQuestion) {
      const updatedQuestions = questions.map(q => 
        q.id === editingQuestion.id ? { ...question, id: q.id } : q
      );
      setQuestions(updatedQuestions);
      toast.success('Question updated successfully!');
    } else {
      setQuestions([...questions, { ...question, id: Date.now().toString() }]);
      toast.success('Question added successfully!');
    }
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success('Question removed successfully!');
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

  const getQuestionTypeLabel = (type) => {
    switch(type) {
      case 'radio': return 'MCQ';
      case 'checkbox': return 'Checkbox';
      case 'text': return 'Text';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">AKJ RESOURCE</h1>
              <p className="text-sm text-gray-500">Online Test</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - grows to push footer down */}
      <div className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b px-6 pt-4">
            <div className="flex gap-6">
              <button
                onClick={() => setStep(1)}
                className={`pb-3 px-2 font-medium transition-colors ${
                  step === 1
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => step === 1 ? null : setStep(2)}
                className={`pb-3 px-2 font-medium transition-colors ${
                  step === 2
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                } ${step === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                Questions Sets
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Back to Dashboard */}
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
            >
              ← Back to Dashboard
            </button>

            {step === 1 && (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleBasicInfoSubmit({
                  title: formData.get('title'),
                  totalCandidates: parseInt(formData.get('totalCandidates')),
                  totalSlots: parseInt(formData.get('totalSlots')),
                  questionSets: parseInt(formData.get('questionSets')),
                  questionType: formData.get('questionType'),
                  startTime: formData.get('startTime'),
                  endTime: formData.get('endTime'),
                  duration: parseInt(formData.get('duration')),
                });
              }} className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Online Test Title *
                  </label>
                  <input 
                    name="title" 
                    required 
                    placeholder="Enter online test title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Candidates *
                    </label>
                    <input 
                      name="totalCandidates" 
                      type="number" 
                      required 
                      placeholder="Total candidates"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Slots *
                    </label>
                    <input 
                      name="totalSlots" 
                      type="number" 
                      required 
                      placeholder="Total slots"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Sets *
                    </label>
                    <input 
                      name="questionSets" 
                      type="number" 
                      required 
                      placeholder="Select total question set"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Type
                    </label>
                    <select 
                      name="questionType" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MCQ">MCQ</option>
                      <option value="Mixed">Mixed</option>
                      <option value="Descriptive">Descriptive</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time *
                    </label>
                    <input 
                      name="startTime" 
                      type="datetime-local" 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time *
                    </label>
                    <input 
                      name="endTime" 
                      type="datetime-local" 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (Minutes) *
                  </label>
                  <input 
                    name="duration" 
                    type="number" 
                    required 
                    placeholder="Duration"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save & Continue
                  </button>
                </div>
              </form>
            )}

            {step === 2 && basicInfo && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Question Sets</h2>
                  <Button onClick={() => {
                    setEditingQuestion(null);
                    setIsModalOpen(true);
                  }}>
                    + Add Question
                  </Button>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No questions added yet.</p>
                    <p className="text-sm mt-2">Click "Add Question" to create your first question.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-gray-700">
                              Question {index + 1}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {getQuestionTypeLabel(question.type)}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {question.score} pt{question.score !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => handleEditQuestion(question)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>

                        <h3 className="text-gray-800 mb-3">{question.title}</h3>

                        {/* Render options for radio/checkbox */}
                        {(question.type === 'radio' || question.type === 'checkbox') && question.options && (
                          <div className="space-y-2 ml-2">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <span className="text-gray-600">
                                  {question.type === 'radio' ? '◉' : '☐'}
                                </span>
                                <span className="text-gray-700">
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </span>
                                {question.correctAnswers?.includes(option) && (
                                  <span className="text-green-600 text-sm ml-2">✓ Correct</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Render text answer preview */}
                        {question.type === 'text' && (
                          <div className="bg-gray-50 p-3 rounded mt-2">
                            <p className="text-sm text-gray-600">
                              <strong>Expected Answer:</strong> {question.correctAnswers?.[0] || 'No answer key provided'}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between mt-6 pt-4 border-t">
                  <Button variant="secondary" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button variant="primary" onClick={handleSaveExam}>
                    Create Exam
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Question Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuestion(null);
        }}
        title={editingQuestion ? "Edit Question" : "Add New Question"}
      >
        <QuestionForm
          onSubmit={handleAddQuestion}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingQuestion(null);
          }}
          initialData={editingQuestion}
        />
      </Modal>

      {/* Footer - Now at the bottom */}
      <div className="bg-[#1a0933] text-white text-sm py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
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
    </div>
  );
}