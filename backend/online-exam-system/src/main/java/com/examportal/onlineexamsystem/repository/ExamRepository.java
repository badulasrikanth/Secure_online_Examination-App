// ── ExamRepository.java ──────────────────────────────────────
package com.examportal.onlineexamsystem.repository;
 
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examportal.onlineexamsystem.model.Exam;
 
@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByIsActiveTrue();
}