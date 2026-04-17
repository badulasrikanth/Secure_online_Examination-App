
package com.examportal.onlineexamsystem.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examportal.onlineexamsystem.dto.ExamDTO;
import com.examportal.onlineexamsystem.dto.QuestionDTO;
import com.examportal.onlineexamsystem.dto.ResultDTO;
import com.examportal.onlineexamsystem.model.Exam;
import com.examportal.onlineexamsystem.model.Question;
import com.examportal.onlineexamsystem.model.Result;
import com.examportal.onlineexamsystem.service.ExamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ExamService examService;

    // ── EXAM MANAGEMENT ────────────────────────────────
    @GetMapping("/exams")
    public ResponseEntity<List<ExamDTO>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams().stream()
                .map(ExamDTO::fromEntity)
                .toList());
    }

    @GetMapping("/exams/{id}")
    public ResponseEntity<?> getExam(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ExamDTO.fromEntity(examService.getExamById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/exams")
    public ResponseEntity<?> createExam(@RequestBody Exam exam) {
        try {
            exam.setTotalMarks(0);
            Exam savedExam = examService.createExam(exam);
            return ResponseEntity.ok(ExamDTO.fromEntity(savedExam));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/exams/{id}")
    public ResponseEntity<?> updateExam(@PathVariable Long id, @RequestBody Exam exam) {
        try {
            Exam updatedExam = examService.updateExam(id, exam);
            return ResponseEntity.ok(ExamDTO.fromEntity(updatedExam));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/exams/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        try {
            examService.deleteExam(id);
            return ResponseEntity.ok(Map.of("message", "Exam deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── QUESTION MANAGEMENT ────────────────────────────
    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        return ResponseEntity.ok(examService.getAllQuestions().stream()
                .map(QuestionDTO::fromEntity)
                .toList());
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(QuestionDTO.fromEntity(examService.getQuestion(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/questions")
    public ResponseEntity<?> createQuestion(@RequestBody Question question) {
        try {
            // Validate required fields
            String validationError = validateQuestion(question);
            if (validationError != null) {
                return ResponseEntity.badRequest().body(Map.of("error", validationError));
            }
            
            Question savedQuestion = examService.createQuestion(question);
            return ResponseEntity.ok(QuestionDTO.fromEntity(savedQuestion));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        try {
            Question updatedQuestion = examService.updateQuestion(id, question);
            return ResponseEntity.ok(QuestionDTO.fromEntity(updatedQuestion));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            examService.deleteQuestion(id);
            return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── EXAM-QUESTION MANAGEMENT ──────────────────────
    @PostMapping("/exams/{examId}/questions")
    public ResponseEntity<?> createQuestionForExam(@PathVariable Long examId, @RequestBody Question question) {
        try {
            // Validate required fields
            String validationError = validateQuestion(question);
            if (validationError != null) {
                return ResponseEntity.badRequest().body(Map.of("error", validationError));
            }
            
            Question savedQuestion = examService.createQuestion(question);
            Exam updatedExam = examService.addQuestionToExam(examId, savedQuestion.getId());
            return ResponseEntity.ok(Map.of(
                "question", QuestionDTO.fromEntity(savedQuestion),
                "exam", ExamDTO.fromEntity(updatedExam)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
 
    @PostMapping("/exams/{examId}/questions/{questionId}")
    public ResponseEntity<?> addQuestionToExam(
            @PathVariable Long examId,
            @PathVariable Long questionId) {
        try {
            Exam updatedExam = examService.addQuestionToExam(examId, questionId);
            return ResponseEntity.ok(ExamDTO.fromEntity(updatedExam));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/exams/{examId}/questions/{questionId}")
    public ResponseEntity<?> removeQuestionFromExam(
            @PathVariable Long examId,
            @PathVariable Long questionId) {
        try {
            Exam updatedExam = examService.removeQuestionFromExam(examId, questionId);
            return ResponseEntity.ok(ExamDTO.fromEntity(updatedExam));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── RESULTS MANAGEMENT ─────────────────────────────
    @GetMapping("/exams/{examId}/results")
    public ResponseEntity<List<ResultDTO>> getExamResults(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getExamResults(examId).stream()
                .map(ResultDTO::fromEntity)
                .toList());
    }

    @GetMapping("/results/{resultId}")
    public ResponseEntity<?> getResult(@PathVariable Long resultId) {
        try {
            Result result = examService.getResult(resultId);
            return ResponseEntity.ok(ResultDTO.fromEntity(result));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ── VALIDATION HELPER ──────────────────────────────
    private String validateQuestion(Question question) {
        if (question.getQuestionText() == null || question.getQuestionText().trim().isEmpty()) {
            return "Question text is required";
        }
        if (question.getOptionA() == null || question.getOptionA().trim().isEmpty()) {
            return "Option A is required";
        }
        if (question.getOptionB() == null || question.getOptionB().trim().isEmpty()) {
            return "Option B is required";
        }
        if (question.getOptionC() == null || question.getOptionC().trim().isEmpty()) {
            return "Option C is required";
        }
        if (question.getOptionD() == null || question.getOptionD().trim().isEmpty()) {
            return "Option D is required";
        }
        if (question.getCorrectAnswer() == null) {
            return "Correct answer is required";
        }
        if (question.getMarks() == null || question.getMarks() <= 0) {
            return "Marks must be a positive number";
        }
        return null; // All validations passed
    }
}