import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { examAPI } from '../../services/api';
import type { Exam } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ExamList: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examAPI.getExams();
      setExams(response);
    } catch (err) {
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleTakeExam = (examId: number) => {
    navigate(`/exam/${examId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading exams...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          {/* Header Section */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <div className="slide-up">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📚 Available Exams
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Welcome, <span className="font-semibold text-indigo-700">{user?.name}</span></p>
              <p className="text-gray-500 text-sm mt-1">Select an exam to get started</p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => navigate('/results')}
                className="btn btn-info"
              >
                📊 View My Results
              </button>
              <button
                onClick={logout}
                className="btn btn-danger"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          {exams.length === 0 ? (
            <div className="card card-info text-center py-16">
              <p className="text-gray-600 text-lg">📭 No exams available at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">Please check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam, index) => {
                const cardColors = [
                  'card-primary',
                  'card-info',
                  'card-purple',
                  'card-cyan',
                  'card-pink',
                ];
                const buttonColors = [
                  'btn-primary',
                  'btn-cyan',
                  'btn-gradient-cool',
                  'btn-info',
                  'btn-purple',
                ];
                const colorIndex = index % cardColors.length;

                return (
                  <div
                    key={exam.id}
                    className={`card ${cardColors[colorIndex]} overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 flex-1">
                          🎯 {exam.title}
                        </h3>
                        <span className="badge badge-primary ml-2">Active</span>
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-2">{exam.description}</p>
                      <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                        <div className="bg-white bg-opacity-60 p-2 rounded">
                          <span className="text-gray-600">⏱️ Duration</span>
                          <p className="font-bold text-indigo-700">{exam.durationMinutes} min</p>
                        </div>
                        <div className="bg-white bg-opacity-60 p-2 rounded">
                          <span className="text-gray-600">📝 Marks</span>
                          <p className="font-bold text-purple-700">{exam.totalMarks}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTakeExam(exam.id)}
                        className={`btn ${buttonColors[colorIndex]} w-full`}
                      >
                        ➡️ Take Exam
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamList;