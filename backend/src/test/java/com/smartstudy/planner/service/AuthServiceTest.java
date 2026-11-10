package com.smartstudy.planner.service;

import com.smartstudy.planner.dto.AuthResponse;
import com.smartstudy.planner.dto.LoginRequest;
import com.smartstudy.planner.dto.RegisterRequest;
import com.smartstudy.planner.entity.Student;
import com.smartstudy.planner.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService:
 * - Registration saves student with BCrypt-hashed password
 * - Email duplication is checked and rejected
 * - Login verifies credentials using BCrypt
 * - Wrong password or unknown email throws error
 */
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private AuthService authService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFullName("Emma Watson");
        registerRequest.setEmail("emma@university.edu");
        registerRequest.setPassword("SecretPass2026");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("emma@university.edu");
        loginRequest.setPassword("SecretPass2026");
    }

    @Test
    @DisplayName("Registration hashes password with BCrypt and saves student to database")
    void testRegistrationSuccess() {
        when(studentRepository.existsByEmail("emma@university.edu")).thenReturn(false);

        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> {
            Student s = invocation.getArgument(0);
            s.setId(10L);
            return s;
        });

        AuthResponse response = authService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getFullName()).isEqualTo("Emma Watson");
        assertThat(response.getEmail()).isEqualTo("emma@university.edu");
        assertThat(response.getMessage()).contains("Registration successful");

        // Verify password was hashed before saving
        ArgumentCaptor<Student> captor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository, times(1)).save(captor.capture());
        Student savedStudent = captor.getValue();

        assertThat(savedStudent.getPassword()).isNotEqualTo("SecretPass2026");
        assertThat(savedStudent.getPassword()).startsWith("$2a$");
        assertThat(passwordEncoder.matches("SecretPass2026", savedStudent.getPassword())).isTrue();
    }

    @Test
    @DisplayName("Registration rejects duplicate email")
    void testRegistrationDuplicateEmailFails() {
        when(studentRepository.existsByEmail("emma@university.edu")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            authService.register(registerRequest);
        });

        assertThat(ex.getMessage()).contains("already exists");
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Login succeeds when password matches BCrypt hash")
    void testLoginSuccess() {
        String hashedPassword = passwordEncoder.encode("SecretPass2026");
        Student existing = new Student("Emma Watson", "emma@university.edu", hashedPassword, "CS", "Sem 2");
        existing.setId(10L);

        when(studentRepository.findByEmail("emma@university.edu")).thenReturn(Optional.of(existing));

        AuthResponse response = authService.login(loginRequest);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getFullName()).isEqualTo("Emma Watson");
        assertThat(response.getEmail()).isEqualTo("emma@university.edu");
        assertThat(response.getMessage()).contains("Login successful");
    }

    @Test
    @DisplayName("Login fails when password does not match")
    void testLoginWrongPasswordFails() {
        String hashedPassword = passwordEncoder.encode("DifferentPassword");
        Student existing = new Student("Emma Watson", "emma@university.edu", hashedPassword, "CS", "Sem 2");

        when(studentRepository.findByEmail("emma@university.edu")).thenReturn(Optional.of(existing));

        loginRequest.setPassword("WrongPassword");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            authService.login(loginRequest);
        });

        assertThat(ex.getMessage()).contains("Invalid email or password");
    }

    @Test
    @DisplayName("Login fails when email is not found")
    void testLoginUnknownEmailFails() {
        when(studentRepository.findByEmail("unknown@university.edu")).thenReturn(Optional.empty());

        loginRequest.setEmail("unknown@university.edu");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            authService.login(loginRequest);
        });

        assertThat(ex.getMessage()).contains("Invalid email or password");
    }
}

