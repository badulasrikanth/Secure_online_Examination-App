import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import type { QuestionDTO } from '../../services/api';

interface QuestionForm {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  marks: number;
}

const ManageQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<QuestionForm>({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: 1,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getQuestions();
      setQuestions(response);
      setError(null);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'marks' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.updateQuestion(editingId, formData);
        setSuccess('Question updated successfully!');
      } else {
        await adminAPI.createQuestion(formData);
        setSuccess('Question created successfully!');
      }

      setFormData({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        marks: 1,
      });
      setEditingId(null);
      setShowForm(false);
      await fetchQuestions();
    } catch (err) {
      setError('Failed to save question');
    }
  };

  const handleEdit = (question: QuestionDTO) => {
    setFormData({
      questionText: question.questionText,
      optionA: question.options[0],
      optionB: question.options[1],
      optionC: question.options[2],
      optionD: question.options[3],
      correctAnswer: question.correctAnswer || 'A',
      marks: question.marks,
    });
    setEditingId(question.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await adminAPI.deleteQuestion(id);
        setSuccess('Question deleted successfully!');
        await fetchQuestions();
      } catch (err) {
        setError('Failed to delete question');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            ❓ Manage Questions
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Create, edit, and organize exam questions with multiple choice options</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-8 rounded-xl bg-red-50 border-l-4 border-red-500 p-6 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-8 rounded-xl bg-green-50 border-l-4 border-green-500 p-6 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
          >
            {showForm ? '✕ Cancel' : '+ Add Question'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-100 mb-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">📝 Question Text</label>
              <textarea
                name="questionText"
                value={formData.questionText}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none hover:border-gray-300 resize-none"
                rows={3}
                placeholder="Enter the exam question here..."
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">🎯 Answer Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['A', 'B', 'C', 'D'].map((letter) => (
                  <div key={letter}>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Option {letter}
                    </label>
                    <input
                      type="text"
                      name={`option${letter}`}
                      value={formData[`option${letter}` as keyof QuestionForm] as string}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none hover:border-gray-300"
                      placeholder={`Enter option ${letter}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">✓ Correct Answer</label>
                <select
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 font-medium transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none hover:border-gray-300 bg-white"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">🎯 Marks</label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleFormChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-500 font-medium transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none hover:border-gray-300"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
              <button
                type="submit"
                className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg font-semibold px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
              >
                {editingId ? '✓ Update Question' : '✓ Create Question'}
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

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-600 text-lg">⏳ Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-600 text-lg">📭 No questions yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="divide-y divide-gray-200">
              {questions.map(question => (
                <div key={question.id} className="p-8 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg leading-relaxed">{question.questionText}</h3>
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                          {question.marks} marks
                        </span>
                        <span className="text-gray-600">
                          Correct: <span className="font-semibold text-emerald-600">{question.correctAnswer}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(question)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors duration-200"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {question.options && question.options.map((option, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                        <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Option {String.fromCharCode(65 + idx)}</p>
                        <p className="text-sm text-gray-900 font-medium">{option}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuestions;
