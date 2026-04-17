

package com.examportal.onlineexamsystem.controller;
 
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examportal.onlineexamsystem.dto.ExamDTO;
import com.examportal.onlineexamsystem.dto.ResultDTO;
import com.examportal.onlineexamsystem.model.Result;
import com.examportal.onlineexamsystem.service.ExamService;

import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {
 
    private final ExamService examService;
 
    @GetMapping
    public ResponseEntity<List<ExamDTO>> getActiveExams() {
        return ResponseEntity.ok(examService.getActiveExams().stream()
                .map(ExamDTO::fromEntityHidingAnswers)
                .toList());
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<?> getExam(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ExamDTO.fromEntityHidingAnswers(examService.getExamById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
 
    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitExam(
            @PathVariable Long id,
            @RequestBody Map<Long, String> answers,
            Authentication authentication) {
        try {
            Result result = examService.submitExam(
                    id, authentication.getName(), answers);
            return ResponseEntity.ok(ResultDTO.fromEntity(result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/results/my-results")
    public ResponseEntity<List<ResultDTO>> getMyResults(Authentication authentication) {
        try {
            List<Result> results = examService.getStudentResults(authentication.getName());
            return ResponseEntity.ok(results.stream()
                    .map(ResultDTO::fromEntity)
                    .toList());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(null);
        }
    }

    @GetMapping("/results/{examId}")
    public ResponseEntity<?> getExamResult(@PathVariable Long examId, Authentication authentication) {
        try {
            Result result = examService.getStudentExamResult(examId, authentication.getName());
            return ResponseEntity.ok(ResultDTO.fromEntity(result));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/result/{resultId}")
    public ResponseEntity<?> getResultById(@PathVariable Long resultId, Authentication authentication) {
        try {
            Result result = examService.getResultById(resultId, authentication.getName());
            return ResponseEntity.ok(ResultDTO.fromEntity(result));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}