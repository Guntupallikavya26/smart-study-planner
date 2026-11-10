package com.smartstudy.planner.repository;

import com.smartstudy.planner.entity.Student;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Verifies Student table persistence, columns, and constraints:
 * - Columns: id, full_name, email, password, created_at
 * - Email uniqueness constraint
 * - BCrypt password storage
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(locations = "classpath:application-test.properties")
public class StudentEntityAndRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private StudentRepository studentRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @Test
    @DisplayName("Verify Student table stores id, full_name, email, password, and created_at")
    void testStudentTableColumnsAndPersistence() {
        String rawPassword = "StudentSecret2026!";
        String hashedPassword = passwordEncoder.encode(rawPassword);

        Student student = new Student(
                "Jane Doe",
                "jane.doe@university.edu",
                hashedPassword,
                "Computer Science",
                "Semester 2"
        );

        Student saved = studentRepository.saveAndFlush(student);

        // 1. Verify id is auto-generated
        assertThat(saved.getId()).isNotNull();

        // 2. Verify full_name is mapped and saved
        assertThat(saved.getFullName()).isEqualTo("Jane Doe");
        assertThat(saved.getName()).isEqualTo("Jane Doe");

        // 3. Verify email is saved
        assertThat(saved.getEmail()).isEqualTo("jane.doe@university.edu");

        // 4. Verify password is stored as BCrypt hash (starts with $2a$ and never raw)
        assertThat(saved.getPassword()).startsWith("$2a$");
        assertThat(saved.getPassword()).isNotEqualTo(rawPassword);
        assertThat(passwordEncoder.matches(rawPassword, saved.getPassword())).isTrue();

        // 5. Verify created_at is automatically populated by @PrePersist
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getCreatedAt()).isBeforeOrEqualTo(LocalDateTime.now());
    }

    @Test
    @DisplayName("Verify email uniqueness constraint is enforced by the database")
    void testEmailUniqueConstraint() {
        String hashedPassword = passwordEncoder.encode("Password123!");

        Student student1 = new Student("Alice", "alice@university.edu", hashedPassword, "CS", "Sem 1");
        studentRepository.saveAndFlush(student1);

        Student student2 = new Student("Alice Duplicate", "alice@university.edu", hashedPassword, "CS", "Sem 1");

        // Duplicate email must violate unique constraint and throw exception
        assertThrows(DataIntegrityViolationException.class, () -> {
            studentRepository.saveAndFlush(student2);
        });
    }

    @Test
    @DisplayName("Verify student data remains queryable and persistent")
    void testStudentPersistenceAcrossTransactions() {
        String hashedPassword = passwordEncoder.encode("Password123!");
        Student student = new Student("Bob Smith", "bob@university.edu", hashedPassword, "Math", "Sem 3");
        Student saved = studentRepository.saveAndFlush(student);

        // Clear persistence context to simulate reading from database in a fresh session
        entityManager.clear();

        Optional<Student> retrieved = studentRepository.findByEmail("bob@university.edu");
        assertThat(retrieved).isPresent();
        assertThat(retrieved.get().getId()).isEqualTo(saved.getId());
        assertThat(retrieved.get().getFullName()).isEqualTo("Bob Smith");
        assertThat(retrieved.get().getEmail()).isEqualTo("bob@university.edu");
        assertThat(passwordEncoder.matches("Password123!", retrieved.get().getPassword())).isTrue();
    }
}
