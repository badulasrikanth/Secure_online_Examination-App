// ── ResultRepository.java ────────────────────────────────────
package com.examportal.onlineexamsystem.repository;
 
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.examportal.onlineexamsystem.model.Result;
 
@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByUserId(Long userId);
    List<Result> findByExamId(Long examId);

    @Query("SELECT r FROM Result r JOIN r.user u WHERE u.email = :email ORDER BY r.submittedAt DESC")
    List<Result> findByUserEmail(@Param("email") String email);

    @Query("SELECT r FROM Result r JOIN r.user u WHERE r.exam.id = :examId AND u.email = :email")
    Optional<Result> findByExamIdAndUserEmail(@Param("examId") Long examId, @Param("email") String email);
}