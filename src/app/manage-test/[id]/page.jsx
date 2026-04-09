'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useExamStore from '@/store/examStore';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import QuestionForm from '@/components/forms/QuestionForm';
import toast from 'react-hot-toast';

export default function ManageTestPage({ params }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const exams = useExamStore((state) => state.exams);
  const updateExam = useExamStore((state) => state.updateExam);
  const router = useRouter();
  
  const [exam, setExam] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Find the exam by id
    const foundExam = exams.find(e => e.id === params.id);
    if (foundExam) {
      setExam(foundExam);
    } else {
      toast.error('Exam not found');
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, params.id, exams]);

  if (!isAuthenticated || !exam) return null;

  const handleAddQuestion = (question) => {
    let updatedQuestions;
    
    if (editingQuestion) {
      updatedQuestions = exam.questions.map(q => 
        q.id === editingQuestion.id ? { ...question, id: q.id } : q
      );
      toast.success('Question updated successfully!');
    } else {
      updatedQuestions = [...exam.questions, { ...question, id: Date.now().toString() }];
      toast.success('Question added successfully!');
    }
    
    const updatedExam = { ...exam, questions: updatedQuestions };
    setExam(updatedExam);
    updateExam(exam.id, updatedExam);
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = (id) => {
    const updatedQuestions = exam.questions.filter(q => q.id !== id);
    const updatedExam = { ...exam, questions: updatedQuestions };
    setExam(updatedExam);
    updateExam(exam.id, updatedExam);
    toast.success('Question removed successfully!');
  };

  const getQuestionTypeIcon = (type) => {
    switch(type) {
      case 'radio': return '◉';
      case 'checkbox': return '☐';
      case 'text': return '📝';
      default: return '?';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">AKU RESOURCE</h1>
                <p className="text-sm text-gray-500">Online Test</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b px-6 pt-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('basic')}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === 'questions'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
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

            {activeTab === 'basic' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Title:</strong> {exam.title}</p>
                  <p><strong>Total Candidates:</strong> {exam.totalCandidates}</p>
                  <p><strong>Total Slots:</strong> {exam.totalSlots}</p>
                  <p><strong>Question Sets:</strong> {exam.questionSets}</p>
                  <p><strong>Duration:</strong> {exam.duration} minutes</p>
                  <p><strong>Start Time:</strong> {new Date(exam.startTime).toLocaleString()}</p>
                  <p><strong>End Time:</strong> {new Date(exam.endTime).toLocaleString()}</p>
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
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

                {exam.questions && exam.questions.length > 0 ? (
                  <div className="space-y-6">
                    {exam.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-gray-700">
                              Question {index + 1}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {question.type === 'radio' ? 'MCQ' : question.type === 'checkbox' ? 'Checkbox' : 'Text'}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {question.score} pt{question.score !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditQuestion(question)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              Remove From Exam
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
                                  <span className="text-green-600 text-sm">✓ Correct</span>
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
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No questions added yet.</p>
                    <p className="text-sm mt-2">Click "Add Question" to create your first question.</p>
                  </div>
                )}
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
    </div>
  );
}