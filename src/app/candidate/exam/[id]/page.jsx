'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ExamScreen({ params }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examData, setExamData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);
  const [examStarted, setExamStarted] = useState(false);

  // Mock questions for the exam
  const mockQuestions = [
    {
      id: 1,
      text: "Which of the following indicators is used to measure market volatility?",
      options: [
        "Relative Strength Index (RSI)",
        "Moving Average Convergence Divergence (MACD)",
        "Bollinger Bands",
        "Fibonacci Retracement"
      ],
      correct: 2
    },
    {
      id: 2,
      text: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Computer Personal Unit",
        "Central Program Utility",
        "Core Processing Utility"
      ],
      correct: 0
    },
    {
      id: 3,
      text: "Which of the following is a programming language?",
      options: [
        "HTML",
        "CSS",
        "JavaScript",
        "XML"
      ],
      correct: 2
    },
    {
      id: 4,
      text: "What is the capital of France?",
      options: [
        "London",
        "Berlin",
        "Paris",
        "Madrid"
      ],
      correct: 2
    },
    {
      id: 5,
      text: "Which company developed JavaScript?",
      options: [
        "Microsoft",
        "Netscape",
        "Google",
        "Apple"
      ],
      correct: 1
    },
    {
      id: 6,
      text: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language"
      ],
      correct: 0
    },
    {
      id: 7,
      text: "Which symbol is used for comments in JavaScript?",
      options: [
        "<!-- -->",
        "/* */",
        "//",
        "#"
      ],
      correct: 2
    },
    {
      id: 8,
      text: "What is the correct way to write a JavaScript array?",
      options: [
        "var colors = 'red', 'green', 'blue'",
        "var colors = (1:'red', 2:'green', 3:'blue')",
        "var colors = ['red', 'green', 'blue']",
        "var colors = {'red', 'green', 'blue'}"
      ],
      correct: 2
    },
    {
      id: 9,
      text: "Which company is known for the Android operating system?",
      options: [
        "Apple",
        "Microsoft",
        "Google",
        "Samsung"
      ],
      correct: 2
    },
    {
      id: 10,
      text: "What does CSS stand for?",
      options: [
        "Creative Style Sheets",
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      correct: 2
    }
  ];

  useEffect(() => {
    const exam = JSON.parse(localStorage.getItem('currentExam'));
    if (!exam) {
      router.push('/candidate/dashboard');
      return;
    }
    setExamData(exam);
    setTimeLeft(exam.duration * 60);
  }, [router]);

  useEffect(() => {
    if (!examStarted || submitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !submitted && timeLeft > 0) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          toast.error(`⚠️ Warning: Tab switched detected! (${newCount}/3)`);
          if (newCount >= 3) {
            autoSubmit();
            toast.error('Exam auto-submitted due to multiple tab switches!');
          }
          return newCount;
        });
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen && !submitted && timeLeft > 0) {
        toast.error('⚠️ Warning: Fullscreen exited!');
      }
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [examStarted, submitted, timeLeft, isFullscreen]);

  useEffect(() => {
    if (!examStarted || submitted) return;
    
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !submitted) {
      autoSubmit();
    }
  }, [timeLeft, submitted, examStarted]);

  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      setShowFullscreenPrompt(false);
      setIsFullscreen(true);
      setExamStarted(true);
    }
  };

  const autoSubmit = () => {
    if (!submitted) {
      setSubmitted(true);
      let score = 0;
      mockQuestions.forEach((q, idx) => {
        if (answers[idx] === q.correct) {
          score++;
        }
      });
      localStorage.setItem('examScore', score);
      localStorage.setItem('totalQuestions', mockQuestions.length);
      toast.error('Time is up! Submitting your exam...');
      setTimeout(() => {
        router.push('/candidate/result');
      }, 2000);
    }
  };

  const handleAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
    toast.success(`Answer saved for Question ${currentQuestion + 1}`);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      toast('Question skipped');
    }
  };

  const handleSubmit = () => {
    if (confirm('Are you sure you want to submit the exam?')) {
      let score = 0;
      mockQuestions.forEach((q, idx) => {
        if (answers[idx] === q.correct) {
          score++;
        }
      });
      localStorage.setItem('examScore', score);
      localStorage.setItem('totalQuestions', mockQuestions.length);
      setSubmitted(true);
      toast.success(`Exam submitted! Score: ${score}/${mockQuestions.length}`);
      setTimeout(() => {
        router.push('/candidate/result');
      }, 2000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / mockQuestions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (!examData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading exam...</div>
      </div>
    );
  }

  if (showFullscreenPrompt && !examStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Akij Resource</h2>
            <h3 className="text-lg font-semibold mb-4">Ready to begin?</h3>
            <p className="text-gray-600 mb-2">Exam: {examData.title}</p>
            <p className="text-gray-600 mb-2">Duration: {examData.duration} minutes</p>
            <p className="text-gray-600 mb-4">Questions: {mockQuestions.length}</p>
            <p className="text-gray-600 mb-6 text-sm">
              ⚠️ Please enter fullscreen mode to start the exam. Tab switching is not allowed.
            </p>
            <button
              onClick={requestFullscreen}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 text-lg font-semibold"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4">Exam Submitted</h2>
            <p className="text-gray-600 mb-6">
              Dear {localStorage.getItem('candidateName')}, your exam has been successfully submitted.
            </p>
            <button
              onClick={() => router.push('/candidate/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-3 fixed top-0 left-0 right-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-gray-800">AKJ RESOURCE</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {mockQuestions.length}
            </div>
            <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
              ⏱️ {formatTime(timeLeft)} left
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-[73px] left-0 right-0 h-1 bg-gray-200 z-40">
        <div 
          className="h-full bg-green-600 transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 pt-24 pb-8 w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Question */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Question {currentQuestion + 1}
              </span>
              {answers[currentQuestion] !== undefined && (
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  ✓ Answered
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {mockQuestions[currentQuestion].text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {mockQuestions[currentQuestion].options.map((option, idx) => (
              <label 
                key={idx} 
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${answers[currentQuestion] === idx 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="question"
                  checked={answers[currentQuestion] === idx}
                  onChange={() => handleAnswer(idx)}
                  className="w-5 h-5 text-green-600"
                />
                <span className="text-gray-700 text-base">
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </span>
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3 pt-4 border-t">
            <button
              onClick={handleSkip}
              className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              ⏭️ Skip this Question
            </button>
            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ◀ Previous
              </button>
              {currentQuestion === mockQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  ✓ Submit Exam
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save & Continue ▶
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Question Navigator</h3>
            <span className="text-sm text-gray-600">
              Answered: {getAnsweredCount()} / {mockQuestions.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockQuestions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors
                  ${currentQuestion === idx 
                    ? 'bg-blue-600 text-white' 
                    : answers[idx] !== undefined 
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a0933] text-white text-sm py-4">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
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