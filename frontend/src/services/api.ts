import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Data Models (matching backend DTOs) ────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface QuestionDTO {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string | null;
  marks: number;
}

export interface ExamDTO {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  isActive: boolean;
  scheduledAt: string | null;
  createdAt: string;
  questions: QuestionDTO[];
}

export interface StudentAnswerDTO {
  id?: number;
  questionId: number;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  marks: number;
  earnedMarks: number;
}

export interface ResultDTO {
  id: number;
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt: string;
  answers: StudentAnswerDTO[];
}

// Legacy interfaces for component compatibility
export interface Question extends QuestionDTO {}
export interface Exam extends ExamDTO {}
export interface Result extends ResultDTO {}

export interface StudentAnswer {
  questionId: number;
  selectedAnswer: string; // Changed from number to string ("A", "B", "C", "D")
}

// ── Auth API ───────────────────────────────────────────────
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string, role?: string) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },
};

// ── Exam API (Student) ─────────────────────────────────────
const normalizeQuestion = (question: any): QuestionDTO => {
  if (question.options && Array.isArray(question.options)) {
    return question as QuestionDTO;
  }

  return {
    ...question,
    options: [question.optionA, question.optionB, question.optionC, question.optionD].filter(
      (option) => option !== undefined && option !== null
    ),
  } as QuestionDTO;
};

export const examAPI = {
  getExams: async () => {
    const response = await api.get('/exams');
    return response.data;
  },

  getExam: async (id: number) => {
    const response = await api.get(`/exams/${id}`);
    const exam = response.data as ExamDTO;
    if (exam.questions) {
      exam.questions = exam.questions.map(normalizeQuestion);
    }
    return exam;
  },

  submitExam: async (examId: number, answers: Map<number, string>) => {
    // Convert Map to plain object for JSON serialization
    const answersObj: Record<number, string> = {};
    answers.forEach((value, key) => {
      answersObj[key] = value;
    });
    const response = await api.post(`/exams/${examId}/submit`, answersObj);
    return response.data as ResultDTO;
  },

  getMyResults: async () => {
    const response = await api.get('/exams/results/my-results');
    return response.data;
  },

  getExamResult: async (examId: number) => {
    const response = await api.get(`/exams/results/${examId}`);
    return response.data;
  },

  getResultById: async (resultId: number) => {
    const response = await api.get(`/exams/result/${resultId}`);
    return response.data;
  },
};

// ── Admin API ──────────────────────────────────────────────
export const adminAPI = {
  // Exam Management
  getExams: async () => {
    const response = await api.get('/admin/exams');
    return response.data;
  },

  getExam: async (id: number) => {
    const response = await api.get(`/admin/exams/${id}`);
    return response.data;
  },

  createExam: async (exam: any) => {
    const response = await api.post('/admin/exams', exam);
    return response.data;
  },

  updateExam: async (id: number, exam: any) => {
    const response = await api.put(`/admin/exams/${id}`, exam);
    return response.data;
  },

  deleteExam: async (id: number) => {
    const response = await api.delete(`/admin/exams/${id}`);
    return response.data;
  },

  // Question Management
  getQuestions: async () => {
    const response = await api.get('/admin/questions');
    return response.data;
  },

  getQuestion: async (id: number) => {
    const response = await api.get(`/admin/questions/${id}`);
    return response.data;
  },

  createQuestion: async (question: any) => {
    const response = await api.post('/admin/questions', question);
    return response.data;
  },

  updateQuestion: async (id: number, question: any) => {
    const response = await api.put(`/admin/questions/${id}`, question);
    return response.data;
  },

  deleteQuestion: async (id: number) => {
    const response = await api.delete(`/admin/questions/${id}`);
    return response.data;
  },

  // Exam-Question Management
  addQuestionToExam: async (examId: number, questionId: number) => {
    const response = await api.post(`/admin/exams/${examId}/questions/${questionId}`);
    return response.data;
  },

  removeQuestionFromExam: async (examId: number, questionId: number) => {
    const response = await api.delete(`/admin/exams/${examId}/questions/${questionId}`);
    return response.data;
  },

  createQuestionForExam: async (examId: number, question: any) => {
    const response = await api.post(`/admin/exams/${examId}/questions`, question);
    return response.data;
  },

  // Results Management
  getExamResults: async (examId: number) => {
    const response = await api.get(`/admin/exams/${examId}/results`);
    return response.data;
  },

  getResult: async (resultId: number) => {
    const response = await api.get(`/admin/results/${resultId}`);
    return response.data;
  },
};

export default api;