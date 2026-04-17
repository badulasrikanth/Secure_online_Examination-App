import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { examAPI } from '../../services/api';
import type { ResultDTO } from '../../services/api';

type LocationState = {
  result?: ResultDTO;
};

const ExamSubmissionConfirmation: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [result, setResult] = useState<ResultDTO | null>(state?.result ?? null);
  const [loading, setLoading] = useState(!state?.result);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!result && resultId) {
      const fetchResult = async () => {
        try {
          setLoading(true);
          const response = await examAPI.getResultById(parseInt(resultId, 10));
          setResult(response);
          setError(null);
        } catch (err) {
          setError('Unable to load the submitted result.');
        } finally {
          setLoading(false);
        }
      };

      fetchResult();
    }
  }, [resultId, result]);

  const handleViewDetails = () => {
    if (result) navigate(`/results/${result.id}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">Loading submission result...</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white shadow rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Submission Complete</h1>
          <p className="text-gray-700 mb-4">Your exam was submitted, but the result could not be loaded right now.</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleBackToDashboard}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const passPercentage = 40;
  const isPassed = result.percentage >= passPercentage;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-3xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exam Submitted</h1>
          <p className="text-gray-600 mt-2">Well done! Your score is ready.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-gray-100 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-4xl font-bold text-gray-900">{result.score}</p>
            <p className="text-sm text-gray-500">of {result.totalMarks}</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-500">Percentage</p>
            <p className="text-4xl font-bold text-gray-900">{result.percentage.toFixed(2)}%</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-500">Status</p>
            <p className={`text-4xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {isPassed ? 'Passed' : 'Failed'}
            </p>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-3xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Submission Details</h2>
          <div className="grid gap-2 text-sm text-gray-700">
            <p><span className="font-semibold">Exam:</span> {result.examTitle}</p>
            <p><span className="font-semibold">Student:</span> {result.studentName}</p>
            <p><span className="font-semibold">Submitted at:</span> {new Date(result.submittedAt).toLocaleString()}</p>
            <p><span className="font-semibold">Correct Answers:</span> {result.answers.filter((a) => a.isCorrect).length} / {result.answers.length}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={handleViewDetails}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full"
          >
            View Full Result
          </button>
          <button
            onClick={handleBackToDashboard}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-full"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSubmissionConfirmation;
