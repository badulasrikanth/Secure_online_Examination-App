package com.examportal.onlineexamsystem.dto;

import com.examportal.onlineexamsystem.model.StudentAnswer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAnswerDTO {
    private Long id;
    private Long questionId;
    private String questionText;
    private String selectedOption;
    private String correctOption;
    private Boolean isCorrect;
    private Integer marks;
    private Integer earnedMarks;

    public static StudentAnswerDTO fromEntity(StudentAnswer answer) {
        return StudentAnswerDTO.builder()
                .id(answer.getId())
                .questionId(answer.getQuestion().getId())
                .questionText(answer.getQuestion().getQuestionText())
                .selectedOption(answer.getSelectedOption() != null ? answer.getSelectedOption().toString() : null)
                .correctOption(answer.getQuestion().getCorrectAnswer().toString())
                .isCorrect(answer.isCorrect())
                .marks(answer.getQuestion().getMarks())
                .earnedMarks(answer.isCorrect() ? answer.getQuestion().getMarks() : 0)
                .build();
    }
}
