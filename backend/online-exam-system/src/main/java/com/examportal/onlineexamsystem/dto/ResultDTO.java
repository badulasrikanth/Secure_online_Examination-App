package com.examportal.onlineexamsystem.dto;

import com.examportal.onlineexamsystem.model.Result;
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
public class ResultDTO {
    private Long id;
    private Long examId;
    private String examTitle;
    private Long studentId;
    private String studentName;
    private Integer score;
    private Integer totalMarks;
    private Double percentage;
    private LocalDateTime submittedAt;
    private List<StudentAnswerDTO> answers;

    public static ResultDTO fromEntity(Result result) {
        double percentage = 0.0;
        if (result.getTotalMarks() > 0) {
            percentage = (result.getScore() * 100.0) / result.getTotalMarks();
        }
        return ResultDTO.builder()
                .id(result.getId())
                .examId(result.getExam().getId())
                .examTitle(result.getExam().getTitle())
                .studentId(result.getUser().getId())
                .studentName(result.getUser().getName())
                .score(result.getScore())
                .totalMarks(result.getTotalMarks())
                .percentage(Math.round(percentage * 100.0) / 100.0)
                .submittedAt(result.getSubmittedAt())
                .answers(result.getStudentAnswers().stream()
                        .map(StudentAnswerDTO::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}
