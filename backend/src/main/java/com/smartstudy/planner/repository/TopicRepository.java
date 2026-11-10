package com.smartstudy.planner.repository;

import com.smartstudy.planner.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for Topic entities.
 */
@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findBySubjectIdOrderByOrderIndexAsc(Long subjectId);

    long countBySubjectIdAndCompletedTrue(Long subjectId);

    long countBySubjectId(Long subjectId);
}

