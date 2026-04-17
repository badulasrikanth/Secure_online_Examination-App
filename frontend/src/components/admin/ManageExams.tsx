import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import type { ExamDTO } from '../../services/api';
import { useNavigate } from 'react-router';

interface ExamForm {
  title: string;
  description: string;
  durationMinutes: number;
  isActive: boolean;
}

const ManageExams: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ExamForm>({
    title: '',
    description: '',
    durationMinutes: 60,
    isActive: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getExams();
      setExams(response);
      setError(null);
    } catch (err) {
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'durationMinutes' ? parseInt(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.updateExam(editingId, formData);
        setSuccess('Exam updated successfully!');
      } else {
        await adminAPI.createExam(formData);
        setSuccess('Exam created successfully!');
      }

      setFormData({
        title: '',
        description: '',
        durationMinutes: 60,
        isActive: true,
      });
      setEditingId(null);
      setShowForm(false);
      await fetchExams();
    } catch (err) {
      setError('Failed to save exam');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await adminAPI.deleteExam(id);
        setSuccess('Exam deleted successfully!');
        await fetchExams();
      } catch (err) {
        setError('Failed to delete exam');
      }
    }
  };

  const handleRemoveQuestion = async (examId: number, questionId: number) => {
    if (window.confirm('Remove this question from the exam?')) {
      try {
        await adminAPI.removeQuestionFromExam(examId, questionId);
        setSuccess('Question removed from exam!');
        await fetchExams();
      } catch (err) {
        setError('Failed to remove question');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      durationMinutes: 60,
      isActive: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  📚 Manage Exams
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Create and configure exams with questions and settings</p>
              </div>
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 transition-all duration-200"
              >
                ← Back to Dashboard
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border-l-4 border-red-500 p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 text-xl font-bold">×</button>
                </div>
              </div>
            )}
            {success && (
              <div className="mb-6 rounded-xl bg-green-50 border-l-4 border-green-500 p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <p className="text-green-800 font-medium">{success}</p>
                  </div>
                  <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800 text-xl font-bold">×</button>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              {showForm ? '✕ Cancel' : '+ Create Exam'}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-100 mb-8">
              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">📝 Exam Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-300"
                    placeholder="e.g., Java Programming Exam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">📄 Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-300 resize-none"
                    rows={4}
                    placeholder="Exam details, topics covered, and instructions..."
                  />
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">⚙️ Exam Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3">⏱️ Duration (minutes)</label>
                      <input
                        type="number"
                        name="durationMinutes"
                        value={formData.durationMinutes}
                        onChange={handleFormChange}
                        min="1"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-300"
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3">✅ Active Status</label>
                      <label className="inline-flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all duration-200 w-full">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleFormChange}
                          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                        <span className="text-gray-800 font-medium">{formData.isActive ? 'Exam is Active' : 'Exam is Inactive'}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                  <button
                    type="submit"
                    className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg font-semibold px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    {editingId ? '✓ Update Exam' : '✓ Create Exam'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex justify-center items-center gap-2 rounded-lg font-semibold px-6 py-3 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-200"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Exams List */}
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-600 text-lg">⏳ Loading exams...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-600 text-lg">📭 No exams yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {exams.map(exam => (
                <div key={exam.id} className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="p-8">
                    <div className="flex justify-between items-start gap-6 mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{exam.title}</h3>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">{exam.description}</p>
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">⏱️</span>
                            <span className="text-gray-700"><span className="font-semibold">{exam.durationMinutes}</span> minutes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{exam.isActive ? '✅' : '⏸️'}</span>
                            <span className="text-gray-700"><span className="font-semibold">{exam.isActive ? 'Active' : 'Inactive'}</span></span>
                          </div>
                          {exam.questions && exam.questions.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xl">📋</span>
                              <span className="text-gray-700"><span className="font-semibold">{exam.questions.length}</span> questions</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>

                    {/* Questions section */}
                    {exam.questions && exam.questions.length > 0 && (
                      <div className="border-t-2 border-gray-200 pt-6 mt-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          📚 Questions ({exam.questions.length})
                        </h4>
                        <div className="space-y-2">
                          {exam.questions.map(q => (
                            <div key={q.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                              <span className="text-gray-800 font-medium">{q.questionText}</span>
                              <button
                                onClick={() => handleRemoveQuestion(exam.id, q.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-semibold"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageExams;
