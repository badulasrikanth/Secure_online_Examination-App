package com.examportal.onlineexamsystem.dto;

import com.examportal.onlineexamsystem.model.Exam;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamDTO {
    private Long id;
    private String title;
    private String description;
    private Integer durationMinutes;
    private Integer totalMarks;
    private Boolean isActive;
    private LocalDateTime scheduledAt;
    private LocalDateTime createdAt;
    private List<QuestionDTO> questions;

    public static ExamDTO fromEntity(Exam exam) {
        return ExamDTO.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .durationMinutes(exam.getDurationMinutes())
                .totalMarks(exam.getTotalMarks())
                .isActive(exam.isActive())
                .scheduledAt(exam.getScheduledAt())
                .createdAt(exam.getCreatedAt())
                .questions(exam.getQuestions().stream()
                        .map(QuestionDTO::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }

    public static ExamDTO fromEntityHidingAnswers(Exam exam) {
        return ExamDTO.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .durationMinutes(exam.getDurationMinutes())
                .totalMarks(exam.getTotalMarks())
                .isActive(exam.isActive())
                .scheduledAt(exam.getScheduledAt())
                .createdAt(exam.getCreatedAt())
                .questions(exam.getQuestions().stream()
                        .map(QuestionDTO::fromEntityHidingAnswer)
                        .collect(Collectors.toList()))
                .build();
    }
}
