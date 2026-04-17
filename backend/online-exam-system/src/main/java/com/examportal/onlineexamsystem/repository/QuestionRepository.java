// ── QuestionRepository.java ──────────────────────────────────
package com.examportal.onlineexamsystem.repository;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examportal.onlineexamsystem.model.Question;
 
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
}