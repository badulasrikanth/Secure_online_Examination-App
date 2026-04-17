import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI } from '../../services/api';
import type { ExamDTO } from '../../services/api';

const TakeExam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamDTO | null>(null);
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchExam(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (exam && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [exam, timeLeft]);

  const fetchExam = async (examId: number) => {
    try {
      const response = await examAPI.getExam(examId);
      setExam(response);
      setTimeLeft(response.durationMinutes * 60); // Convert to seconds
      setAnswers(new Map());
    } catch (error) {
      alert('Failed to load exam');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const question = exam!.questions[questionIndex];
    const answerMap = new Map(answers);
    const answerLetters = ['A', 'B', 'C', 'D'];
    answerMap.set(question.id, answerLetters[answerIndex]);
    setAnswers(answerMap);
  };

  const handleSubmitExam = async () => {
    if (!exam) return;

    setSubmitting(true);
    try {
      const result = await examAPI.submitExam(exam.id, answers);
      navigate(`/exam/${result.id}/confirmation`, { state: { result } });
    } catch (error) {
      alert('Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading exam...</div>
      </div>
    );
  }

  if (!exam || exam.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Exam not found or has no questions</div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];
  const selectedAnswer = answers.get(question.id);
  const answerLetters = ['A', 'B', 'C', 'D'];
  const selectedIndex = selectedAnswer ? answerLetters.indexOf(selectedAnswer) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="card card-info shadow-2xl mb-6">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 -m-6 mb-4 p-4 rounded-t-lg">
            <h1 className="text-3xl font-bold text-white">{exam.title}</h1>
            <p className="text-cyan-50 mt-1">{exam.description}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-gray-700 font-semibold">📝 Question <span className="text-cyan-600 text-2xl">{currentQuestion + 1}</span> of <span className="text-cyan-600">{exam.questions.length}</span></p>
            </div>
            <div className={`text-center p-3 rounded-lg ${timeLeft <= 60 ? 'bg-red-100' : 'bg-cyan-100'}`}>
              <p className={`text-sm font-semibold ${timeLeft <= 60 ? 'text-red-600' : 'text-cyan-600'}`}>⏱️ Time Left</p>
              <p className={`text-3xl font-bold ${timeLeft <= 60 ? 'text-red-700' : 'text-cyan-700'}`}>{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card card-primary shadow-xl mb-6 p-8">
          <div className="mb-6">
            <p className="text-sm text-indigo-600 font-semibold uppercase">Question {currentQuestion + 1}</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">{question.questionText}</h2>
          </div>
          
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedIndex === index;
              return (
                <label
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(currentQuestion, index)}
                    className="mr-3 w-5 h-5 accent-indigo-600"
                  />
                  <span className={`font-bold mr-3 px-3 py-1 rounded text-white ${
                    isSelected ? 'bg-indigo-600' : 'bg-gray-400'
                  }`}>
                    {answerLetters[index]}
                  </span>
                  <span className={`text-lg ${isSelected ? 'text-indigo-900 font-semibold' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mb-6">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⬅️ Previous
          </button>

          <div className="flex-1"></div>

          {currentQuestion === exam.questions.length - 1 ? (
            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="btn btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '⏳ Submitting...' : '✅ Submit Exam'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))}
              className="btn btn-info"
            >
              Next ➡️
            </button>
          )}
        </div>

        {/* Question Navigation Grid */}
        <div className="card shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📌 Question Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {exam.questions.map((q, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-full h-10 rounded font-bold text-sm transition-all transform hover:scale-110 ${
                  index === currentQuestion
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : answers.has(q.id)
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              <span className="text-gray-600">Current Question</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <span className="text-gray-600">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-200"></div>
              <span className="text-gray-600">Not Answered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;