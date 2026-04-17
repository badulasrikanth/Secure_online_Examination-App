package com.examportal.onlineexamsystem.model;
 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
 
@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;
 
    @Column(name = "option_a", nullable = false)
    private String optionA;
 
    @Column(name = "option_b", nullable = false)
    private String optionB;
 
    @Column(name = "option_c", nullable = false)
    private String optionC;
 
    @Column(name = "option_d", nullable = false)
    private String optionD;
 
    @Enumerated(EnumType.STRING)
    @Column(name = "correct_answer", nullable = false)
    private Option correctAnswer;
 
    @Column(nullable = false)
    @Builder.Default
    private Integer marks = 1;
 
    @PrePersist
    public void prePersist() {
        if (marks == null) {
            marks = 1;
        }
    }
 
    public enum Option {
        A, B, C, D
    }
}
 