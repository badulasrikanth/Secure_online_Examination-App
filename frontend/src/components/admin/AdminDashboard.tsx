import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import type { Exam } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await adminAPI.getExams();
      setExams(response);
      setError(null);
    } catch (err) {
      setError('Failed to load exams');
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeExams = exams.filter(exam => exam.isActive).length;
  const totalQuestions = exams.reduce((sum, exam) => sum + exam.questions.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 slide-up gap-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                👨‍💼 Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Online Exam System Management & Control Center</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="card card-primary px-6 py-4 shadow-lg">
                <p className="text-sm text-gray-600 font-semibold">Welcome</p>
                <p className="text-2xl font-bold text-indigo-700">{user?.name}</p>
                <p className="text-xs text-gray-500 mt-1">Admin User</p>
              </div>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stat-card blue">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">📝 Total Exams</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{exams.length}</p>
                </div>
              </div>
            </div>

            <div className="stat-card green">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">✅ Active Exams</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{activeExams}</p>
                </div>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">❓ Total Questions</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">{totalQuestions}</p>
                </div>
              </div>
            </div>

            <div className="stat-card cyan">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">🎯 Your Role</p>
                  <p className="text-3xl font-bold text-cyan-600 mt-2">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Management Options */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">⚙️ Admin Management Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => navigate('/admin/manage-exams')}
                className="card card-info shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left p-0 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-cyan-300 to-blue-400 p-4">
                  <h3 className="text-2xl font-bold text-white">📋 Manage Exams</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 font-semibold mb-4">Create, edit, and manage exams</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ Create new exams</p>
                    <p>✓ Edit exam details</p>
                    <p>✓ Set exam availability</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/manage-questions')}
                className="card card-success shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left p-0 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-300 to-emerald-400 p-4">
                  <h3 className="text-2xl font-bold text-white">❓ Manage Questions</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 font-semibold mb-4">Create and manage exam questions</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ Create question bank</p>
                    <p>✓ Add options and answers</p>
                    <p>✓ Allocate marks</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Rules Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card card-primary shadow-lg">
              <h3 className="text-xl font-bold text-indigo-900 mb-4">👨‍🎓 Student Capabilities</h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>View available exams</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Take active exams</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Answer questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Submit exam responses</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>View their results</span>
                </li>
              </ul>
            </div>

            <div className="card card-info shadow-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-4">👨‍💼 Admin Capabilities</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Create and edit exams</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Create questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Add questions to exams</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>Remove questions from exams</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>View student results</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Active Exams List */}
          {exams.length > 0 && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">📚 Exams Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam, index) => {
                  const badgeColors = [
                    'badge-primary',
                    'badge-info',
                    'badge-success',
                    'badge-purple',
                    'badge-pink',
                  ];
                  return (
                    <div
                      key={exam.id}
                      className={`card ${exam.isActive ? 'card-success' : 'card-primary'} shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">{exam.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{exam.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <span className={`badge ${badgeColors[index % badgeColors.length]}`}>
                          {exam.isActive ? '✅ ACTIVE' : '⏸️ INACTIVE'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 text-sm bg-white bg-opacity-50 p-3 rounded">
                        <span className="text-gray-700"><strong>⏱️ Duration:</strong> {exam.durationMinutes} minutes</span>
                        <span className="text-gray-700"><strong>❓ Questions:</strong> {exam.questions.length}</span>
                        <span className="text-gray-700"><strong>⭐ Total Marks:</strong> {exam.totalMarks}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
