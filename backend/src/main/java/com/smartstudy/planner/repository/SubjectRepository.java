package com.smartstudy.planner.repository;

import com.smartstudy.planner.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Subject entities.
 */
@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByStudentId(Long studentId);

    Optional<Subject> findByIdAndStudentId(Long id, Long studentId);

    boolean existsByCodeAndStudentId(String code, Long studentId);
}

