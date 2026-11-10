package com.smartstudy.planner.repository;

import com.smartstudy.planner.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for Student entities.
 * Provides out-of-the-box CRUD operations (save, findById, findAll, deleteById, etc.)
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);
}

