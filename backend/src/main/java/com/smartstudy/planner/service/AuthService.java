package com.smartstudy.planner.service;

import com.smartstudy.planner.dto.AuthResponse;
import com.smartstudy.planner.dto.LoginRequest;
import com.smartstudy.planner.dto.RegisterRequest;
import com.smartstudy.planner.entity.Student;
import com.smartstudy.planner.repository.StudentRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * AuthService handles student Registration and Login.
 *
 * HOW PASSWORDS WORK (beginner-friendly explanation):
 * ---------------------------------------------------
 * 1. When a student registers, we hash their password with BCrypt before saving.
 *    BCrypt turns "mypassword" into something like "$2a$10$xyz..." — a scrambled
 *    string that cannot be reversed back to the original password.
 *
 * 2. The hashed string is stored in the MySQL 'students.password' column.
 *
 * 3. When a student logs in, we use passwordEncoder.matches(rawPassword, storedHash)
 *    which re-scrambles the input and checks it against the stored hash — WITHOUT
 *    ever decrypting the hash.
 *
 * This means even if someone accessed the database, they could NOT read passwords.
 */
@Service
@Transactional
public class AuthService {

    private final StudentRepository studentRepository;
    // BCryptPasswordEncoder is the industry-standard password hasher.
    // Strength 10 means it runs 2^10 = 1024 internal rounds — slow enough to
    // resist brute-force attacks but fast enough for normal login.
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public AuthService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Register a new student account.
     *
     * Steps:
     *  1. Check that the email is not already taken.
     *  2. Hash the password with BCrypt.
     *  3. Save the student record to MySQL.
     *  4. Return a safe AuthResponse (no password included).
     */
    public AuthResponse register(RegisterRequest request) {
        // Step 1 — Duplicate email check
        if (studentRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new IllegalArgumentException(
                "An account with email '" + request.getEmail() + "' already exists. Please log in."
            );
        }

        // Step 2 — Hash the plain-text password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Step 3 — Build and persist the Student entity
        Student student = new Student(
            request.getFullName().trim(),
            request.getEmail().toLowerCase().trim(),
            hashedPassword,          // BCrypt hash — not plain text
            "Student",               // default course (can be updated later)
            "Semester 1"             // default semester
        );

        Student saved = studentRepository.save(student);

        // Step 4 — Return response without the password
        return new AuthResponse(
            saved.getId(),
            saved.getName(),
            saved.getEmail(),
            saved.getCourse(),
            saved.getSemester(),
            "Registration successful! Welcome, " + saved.getName() + "."
        );
    }

    /**
     * Log in an existing student.
     *
     * Steps:
     *  1. Look up the student by email in MySQL.
     *  2. Use BCrypt to verify the submitted password against the stored hash.
     *  3. Return an AuthResponse on success, or throw an exception on failure.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Step 1 — Find student by email (case-insensitive)
        Student student = studentRepository
            .findByEmail(request.getEmail().toLowerCase().trim())
            .orElseThrow(() ->
                new IllegalArgumentException("Invalid email or password.")
            );

        // Step 2 — Compare the submitted password against the BCrypt hash
        boolean passwordMatches = passwordEncoder.matches(
            request.getPassword(),
            student.getPassword()
        );

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        // Step 3 — Return safe profile data (password excluded)
        return new AuthResponse(
            student.getId(),
            student.getName(),
            student.getEmail(),
            student.getCourse(),
            student.getSemester(),
            "Login successful! Welcome back, " + student.getName() + "."
        );
    }
}

