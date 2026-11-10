package com.smartstudy.planner.repository;

import com.smartstudy.planner.entity.StudyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data JPA Repository for StudyTask entities.
 */
@Repository
public interface StudyTaskRepository extends JpaRepository<StudyTask, Long> {

    List<StudyTask> findByStudentId(Long studentId);

    List<StudyTask> findByStudentIdAndScheduledDate(Long studentId, LocalDate scheduledDate);

    List<StudyTask> findByStudentIdAndCompleted(Long studentId, boolean completed);

    List<StudyTask> findBySubjectId(Long subjectId);
}

