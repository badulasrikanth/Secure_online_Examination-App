package com.examportal.onlineexamsystem.dto;

import com.examportal.onlineexamsystem.model.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Long id;
    private String questionText;
    private List<String> options;
    private String correctAnswer;
    private Integer marks;

    public static QuestionDTO fromEntity(Question question) {
        return QuestionDTO.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .options(Arrays.asList(
                        question.getOptionA(),
                        question.getOptionB(),
                        question.getOptionC(),
                        question.getOptionD()
                ))
                .correctAnswer(question.getCorrectAnswer() != null ? question.getCorrectAnswer().toString() : null)
                .marks(question.getMarks())
                .build();
    }

    public static QuestionDTO fromEntityHidingAnswer(Question question) {
        QuestionDTO dto = fromEntity(question);
        dto.setCorrectAnswer(null);
        return dto;
    }
}
