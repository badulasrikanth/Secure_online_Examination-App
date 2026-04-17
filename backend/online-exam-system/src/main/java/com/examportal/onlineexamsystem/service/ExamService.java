package com.examportal.onlineexamsystem.service;
 
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examportal.onlineexamsystem.model.Exam;
import com.examportal.onlineexamsystem.model.Question;
import com.examportal.onlineexamsystem.model.Result;
import com.examportal.onlineexamsystem.model.StudentAnswer;
import com.examportal.onlineexamsystem.model.User;
import com.examportal.onlineexamsystem.repository.ExamRepository;
import com.examportal.onlineexamsystem.repository.QuestionRepository;
import com.examportal.onlineexamsystem.repository.ResultRepository;
import com.examportal.onlineexamsystem.repository.StudentAnswerRepository;
import com.examportal.onlineexamsystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class ExamService {
 
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final ResultRepository resultRepository;
    private final UserRepository userRepository;
    private final StudentAnswerRepository studentAnswerRepository;
 
    // ── Student ───────────────────────────────────────────────
 
    public List<Exam> getActiveExams() {
        return examRepository.findByIsActiveTrue();
    }
 
    public Exam getExamById(Long examId) {
        return examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found: " + examId));
    }
 
    @Transactional
    public Result submitExam(Long examId, String userEmail, Map<Long, String> answers) {
        Exam exam = getExamById(examId);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
 
        Result result = Result.builder()
                .user(user)
                .exam(exam)
                .score(0)
                .totalMarks(exam.getTotalMarks())
                .build();
        result = resultRepository.save(result);
 
        int score = 0;
        for (Question question : exam.getQuestions()) {
            String selected = answers.get(question.getId());
            boolean correct = false;
 
            if (selected != null) {
                try {
                    Question.Option selectedOption =
                            Question.Option.valueOf(selected.toUpperCase());
                    correct = (selectedOption == question.getCorrectAnswer());
                    if (correct) score += question.getMarks();
 
                    StudentAnswer studentAnswer = StudentAnswer.builder()
                            .result(result)
                            .question(question)
                            .selectedOption(selectedOption)
                            .isCorrect(correct)
                            .build();
                    studentAnswer = studentAnswerRepository.save(studentAnswer);
                    result.getStudentAnswers().add(studentAnswer);
                } catch (IllegalArgumentException ignored) {
                    // invalid option value — skip
                }
            }
        }
 
        result.setScore(score);
        return resultRepository.save(result);
    }
 
    @Transactional(readOnly = true)
    public List<Result> getStudentResults(String userEmail) {
        return resultRepository.findByUserEmail(userEmail);
    }

    @Transactional(readOnly = true)
    public Result getStudentExamResult(Long examId, String userEmail) {
        return resultRepository.findByExamIdAndUserEmail(examId, userEmail)
                .orElseThrow(() -> new RuntimeException("Result not found for this exam"));
    }

    @Transactional(readOnly = true)
    public Result getResultById(Long resultId, String userEmail) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        if (!result.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        return result;
    }
 
    // ── Admin ─────────────────────────────────────────────────

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }

    public Exam updateExam(Long examId, Exam examData) {
        Exam exam = getExamById(examId);
        if (examData.getTitle() != null) exam.setTitle(examData.getTitle());
        if (examData.getDescription() != null) exam.setDescription(examData.getDescription());
        exam.setDurationMinutes(examData.getDurationMinutes());
        exam.setActive(examData.isActive());
        if (examData.getScheduledAt() != null) exam.setScheduledAt(examData.getScheduledAt());
        return examRepository.save(exam);
    }

    @Transactional
    public void deleteExam(Long examId) {
        Exam exam = getExamById(examId);
        examRepository.delete(exam);
    }

    public Question createQuestion(Question question) {
        if (question.getMarks() == null) {
            question.setMarks(1);
        }
        return questionRepository.save(question);
    }

    public Question getQuestion(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found: " + questionId));
    }

    public Question updateQuestion(Long questionId, Question questionData) {
        Question question = getQuestion(questionId);
        if (questionData.getQuestionText() != null) question.setQuestionText(questionData.getQuestionText());
        if (questionData.getOptionA() != null) question.setOptionA(questionData.getOptionA());
        if (questionData.getOptionB() != null) question.setOptionB(questionData.getOptionB());
        if (questionData.getOptionC() != null) question.setOptionC(questionData.getOptionC());
        if (questionData.getOptionD() != null) question.setOptionD(questionData.getOptionD());
        if (questionData.getCorrectAnswer() != null) question.setCorrectAnswer(questionData.getCorrectAnswer());
        if (questionData.getMarks() != null) question.setMarks(questionData.getMarks());
        return questionRepository.save(question);
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        Question question = getQuestion(questionId);
        questionRepository.delete(question);
    }

    @Transactional
    public Exam addQuestionToExam(Long examId, Long questionId) {
        Exam exam = getExamById(examId);
        Question question = getQuestion(questionId);

        if (!exam.getQuestions().contains(question)) {
            exam.getQuestions().add(question);
            exam.setTotalMarks(exam.getTotalMarks() + question.getMarks());
            examRepository.save(exam);
        }
        return exam;
    }

    @Transactional
    public Exam removeQuestionFromExam(Long examId, Long questionId) {
        Exam exam = getExamById(examId);
        Question question = getQuestion(questionId);

        if (exam.getQuestions().contains(question)) {
            exam.getQuestions().remove(question);
            exam.setTotalMarks(Math.max(0, exam.getTotalMarks() - question.getMarks()));
            examRepository.save(exam);
        }
        return exam;
    }

    public List<Result> getExamResults(Long examId) {
        return resultRepository.findByExamId(examId);
    }

    public Result getResult(Long resultId) {
        return resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found: " + resultId));
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
}