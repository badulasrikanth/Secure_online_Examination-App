import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI } from '../../services/api';
import type { ResultDTO } from '../../services/api';

const ExamResult: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resultId) {
      fetchResult(parseInt(resultId));
    }
  }, [resultId]);

  const fetchResult = async (id: number) => {
    try {
      const response = await examAPI.getResultById(id);
      setResult(response);
      setError(null);
    } catch (err) {
      setError('Failed to load exam result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">Loading result...</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error || 'Result not found'}</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const passPercentage = 40; // Assume 40% is passing grade
  const isPassed = result.percentage >= passPercentage;
  const scoreColor = isPassed ? 'text-green-600' : 'text-red-600';
  const statusBg = isPassed ? 'bg-green-100' : 'bg-red-100';
  const statusText = isPassed ? 'PASSED' : 'FAILED';
  const statusColor = isPassed ? 'text-green-700' : 'text-red-700';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{result.examTitle}</h1>
          <p className="text-gray-600">Exam Result Summary</p>
        </div>

        {/* Score Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className={`inline-block ${statusBg} px-6 py-3 rounded-full mb-4`}>
              <span className={`text-2xl font-bold ${statusColor}`}>{statusText}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Score */}
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Your Score</p>
              <p className={`text-4xl font-bold ${scoreColor}`}>{result.score}</p>
              <p className="text-gray-600 text-sm">out of {result.totalMarks}</p>
            </div>

            {/* Percentage */}
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Percentage</p>
              <p className={`text-4xl font-bold ${scoreColor}`}>{result.percentage.toFixed(2)}%</p>
              <p className="text-gray-600 text-sm">Achievement Rate</p>
            </div>

            {/* Status */}
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Status</p>
              <p className={`text-4xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {isPassed ? '✓' : '✗'}
              </p>
              <p className="text-gray-600 text-sm">
                {isPassed ? 'Congratulations!' : 'Better luck next time!'}
              </p>
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-gray-50 rounded p-4 text-center text-sm text-gray-600">
            <p>Submitted on {new Date(result.submittedAt).toLocaleString()}</p>
            <p>Student: {result.studentName}</p>
          </div>
        </div>

        {/* Answer Review */}
        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Answer Review</h2>
          {!result.answers || result.answers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No detailed answers available for this exam.</p>
            </div>
          ) : (
          <div className="space-y-6">
            {result.answers.map((answer, index) => (
              <div key={answer.id || index} className="border-l-4 pl-4" style={{
                borderColor: answer.isCorrect ? '#10b981' : '#ef4444'
              }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">Question {index + 1}</h3>
                    <p className="text-gray-700 text-sm mt-1">{answer.questionText}</p>
                  </div>
                  <div className={`text-sm font-bold px-3 py-1 rounded ${
                    answer.isCorrect
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded p-3 mt-2 space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Your Answer:</p>
                    <p className={`font-semibold ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {answer.selectedOption}
                    </p>
                  </div>
                  {!answer.isCorrect && (
                    <div>
                      <p className="text-gray-600">Correct Answer:</p>
                      <p className="font-semibold text-green-600">{answer.correctOption}</p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Marks:</span>
                    <span className="font-semibold">{answer.earnedMarks}/{answer.marks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/exams')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-md"
          >
            View Other Exams
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
