import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const CreateExam: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [totalMarks, setTotalMarks] = useState(0);
  const [scheduledAt, setScheduledAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminAPI.createExam({
        title,
        description,
        durationMinutes,
        totalMarks,
        scheduledAt: scheduledAt || undefined,
        isActive,
      });
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Failed to create exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              📋 Create Exam
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Set up a new exam with duration, marks, and scheduling options
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 transition-all duration-200 hover:shadow-md"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Content card */}
        <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-100">

        {error && (
          <div className="mb-8 rounded-xl bg-red-50 border-l-4 border-red-500 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <span className="text-2xl">❌</span>
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-red-800 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-7" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">📝 Exam Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none hover:border-gray-300"
              placeholder="e.g., Java Programming Final Exam"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">📄 Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none hover:border-gray-300 resize-none"
              placeholder="Provide details about the exam, instructions, or topics covered..."
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">⚙️ Exam Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">⏱️ Duration (minutes)</label>
                <input
                  type="number"
                  min={1}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none hover:border-gray-300"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">🎯 Total Marks</label>
                <input
                  type="number"
                  min={0}
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none hover:border-gray-300"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">✅ Active Status</label>
                <select
                  value={isActive ? 'true' : 'false'}
                  onChange={(e) => setIsActive(e.target.value === 'true')}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 font-medium transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none hover:border-gray-300 bg-white"
                >
                  <option value="true">✓ Active</option>
                  <option value="false">✗ Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">🕐 Scheduled Start (Optional)</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none hover:border-gray-300"
            />
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              💡 Set an optional start time for the exam. Leave blank to make it available immediately.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg font-semibold px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Creating...' : '✓ Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default CreateExam;
