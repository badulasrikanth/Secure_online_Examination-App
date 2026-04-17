import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examAPI } from '../../services/api';
import type { ResultDTO } from '../../services/api';

const MyResults: React.FC = () => {
  const [results, setResults] = useState<ResultDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await examAPI.getMyResults();
      setResults(response);
    } catch (err) {
      setError('Failed to load your results.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">Loading your results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl font-semibold mb-4">{error}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 slide-up">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
              📊 My Results
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Review your completed exams and detailed breakdowns</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 md:mt-0 btn btn-info"
          >
            ↩️ Back to Dashboard
          </button>
        </div>

        {results.length === 0 ? (
          <div className="card card-info text-center py-16">
            <p className="text-gray-700 text-2xl font-bold">📭 No Results Yet</p>
            <p className="text-gray-600 mt-2 mb-6">You haven't completed any exams</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-success inline-block"
            >
              🎯 Browse Available Exams
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {results.map((result, index) => {
              const passPercentage = 40;
              const isPassed = result.percentage >= passPercentage;
              const cardStyles = [
                'card-success',
                'card-cyan',
                'card-info',
                'card-primary',
              ];
              const badgeColor = index % cardStyles.length;

              return (
                <div key={result.id} className={`card ${cardStyles[badgeColor]} shadow-lg hover:shadow-2xl transition-all duration-300`}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">{result.examTitle}</h2>
                        {isPassed ? (
                          <span className="badge badge-success">✅ PASSED</span>
                        ) : (
                          <span className="badge badge-danger">❌ FAILED</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">📅 Submitted on {new Date(result.submittedAt).toLocaleString()}</p>
                    </div>

                    {/* Score Card */}
                    <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center shadow">
                      <p className="text-sm text-gray-500 mb-1">Your Score</p>
                      <p className={`text-3xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                        {result.score}/{result.totalMarks}
                      </p>
                      <p className="text-lg font-semibold text-gray-700 mt-1">
                        {result.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold">📈 Percentage</p>
                      <p className="text-xl font-bold text-indigo-600 mt-1">{result.percentage.toFixed(2)}%</p>
                    </div>
                    <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold">✍️ Answers</p>
                      <p className="text-xl font-bold text-purple-600 mt-1">{result.answers.length}</p>
                    </div>
                    <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold">👤 Student</p>
                      <p className="text-lg font-bold text-cyan-600 mt-1">{result.studentName}</p>
                    </div>
                    <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold">🎯 Result</p>
                      <p className={`text-lg font-bold mt-1 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                        {isPassed ? 'PASSED' : 'FAILED'}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => navigate(`/results/${result.id}`)}
                      className="btn btn-gradient-cool"
                    >
                      🔍 View Detailed Analysis
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResults;
