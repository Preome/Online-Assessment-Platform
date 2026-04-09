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
    },
    {
      id: 11,
      text: "Which of the following is a NoSQL database?",
      options: [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "SQLite"
      ],
      correct: 2
    },
    {
      id: 12,
      text: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Application Program Interface",
        "Advanced Programming Interface",
        "Application Programming Integration"
      ],
      correct: 0
    },
    {
      id: 13,
      text: "Which HTTP method is used to retrieve data from a server?",
      options: [
        "POST",
        "GET",
        "PUT",
        "DELETE"
      ],
      correct: 1
    },
    {
      id: 14,
      text: "What is the default port for HTTPS?",
      options: [
        "80",
        "443",
        "8080",
        "3000"
      ],
      correct: 1
    },
    {
      id: 15,
      text: "Which of the following is a JavaScript framework?",
      options: [
        "Django",
        "Flask",
        "React",
        "Laravel"
      ],
      correct: 2
    },
    {
      id: 16,
      text: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "Standard Query Language",
        "System Query Language"
      ],
      correct: 0
    },
    {
      id: 17,
      text: "Which company developed Windows operating system?",
      options: [
        "Apple",
        "Google",
        "Microsoft",
        "IBM"
      ],
      correct: 2
    },
    {
      id: 18,
      text: "What does RAM stand for?",
      options: [
        "Readily Available Memory",
        "Random Access Memory",
        "Read Access Memory",
        "Rapid Access Memory"
      ],
      correct: 1
    },
    {
      id: 19,
      text: "Which of the following is used for version control?",
      options: [
        "Docker",
        "Git",
        "Jenkins",
        "Kubernetes"
      ],
      correct: 1
    },
    {
      id: 20,
      text: "What does IDE stand for?",
      options: [
        "Integrated Development Environment",
        "Integrated Design Environment",
        "Internal Development Environment",
        "Integrated Data Environment"
      ],
      correct: 0
    }
  ];

  useEffect(() => {
    const exam = JSON.parse(localStorage.getItem('currentExam'));
    if (!exam) {
      router.push('/candidate/dashboard');
      return;
    }
    setExamData(exam);
    // Set timer based on exam duration (in minutes)
    setTimeLeft(exam.duration * 60);
  }, [router]);

  useEffect(() => {
    // Behavioral tracking
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
        toast.error('⚠️ Warning: Fullscreen exited! Exam will be submitted in 5 seconds.');
        setTimeout(() => {
          if (!document.fullscreenElement && !submitted) {
            autoSubmit();
          }
        }, 5000);
      }
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [submitted, timeLeft, isFullscreen]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !submitted && !submitted) {
      autoSubmit();
    }
  }, [timeLeft, submitted]);

  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      setShowFullscreenPrompt(false);
      setIsFullscreen(true);
    }
  };

  const autoSubmit = () => {
    if (!submitted) {
      setSubmitted(true);
      // Calculate score
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
      autoSubmit();
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

  if (!examData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4">Akij Resource</h2>
            <p className="text-gray-600 mb-6">
              Dear {localStorage.getItem('candidateName')}, Your exam has been submitted. Thank you for participating.
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
              Question ({currentQuestion + 1}/{mockQuestions.length})
            </div>
            <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
              {formatTime(timeLeft)} left
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-[73px] left-0 right-0 h-1 bg-gray-200 z-40">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 pt-24 pb-8 w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">
            Q{currentQuestion + 1}. {mockQuestions[currentQuestion].text}
          </h2>

          <div className="space-y-3 mb-8">
            {mockQuestions[currentQuestion].options.map((option, idx) => (
              <label 
                key={idx} 
                className={`flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors
                  ${answers[currentQuestion] === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <input
                  type="radio"
                  name="question"
                  checked={answers[currentQuestion] === idx}
                  onChange={() => handleAnswer(idx)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">
                  {String.fromCharCode(65 + idx)}. {option}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t">
            <button
              onClick={handleSkip}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip this Question
            </button>
            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {currentQuestion === mockQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Exam
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save & Continue
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Question Navigator</h3>
          <div className="flex flex-wrap gap-2">
            {mockQuestions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors
                  ${currentQuestion === idx 
                    ? 'bg-blue-600 text-white' 
                    : answers[idx] !== undefined 
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

      {/* Fullscreen prompt on load */}
      {showFullscreenPrompt && !isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md text-center">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-4">Enter Fullscreen Mode</h3>
            <p className="text-gray-600 mb-4">
              Please enter fullscreen mode to start the exam. This ensures a fair testing environment.
            </p>
            <button
              onClick={requestFullscreen}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Enter Fullscreen & Start Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}