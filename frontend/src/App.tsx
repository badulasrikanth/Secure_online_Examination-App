import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ExamList from './components/exam/ExamList';
import TakeExam from './components/exam/TakeExam';
import ExamResult from './components/exam/ExamResult';
import MyResults from './components/exam/MyResults';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageExams from './components/admin/ManageExams';
import ManageQuestions from './components/admin/ManageQuestions';
import ExamSubmissionConfirmation from './components/exam/ExamSubmissionConfirmation';
import './App.css';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// App Routes component
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <Register />}
      />

      {/* Student routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ExamList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam/:id"
        element={
          <ProtectedRoute>
            <TakeExam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <MyResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam/:examId/confirmation"
        element={
          <ProtectedRoute>
            <ExamSubmissionConfirmation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:examId"
        element={
          <ProtectedRoute>
            <ExamResult />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-exams"
        element={
          <ProtectedRoute adminOnly>
            <ManageExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-questions"
        element={
          <ProtectedRoute adminOnly>
            <ManageQuestions />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
