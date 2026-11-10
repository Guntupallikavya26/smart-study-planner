package com.smartstudy.planner.controller;

import com.smartstudy.planner.dto.AuthResponse;
import com.smartstudy.planner.dto.LoginRequest;
import com.smartstudy.planner.dto.RegisterRequest;
import com.smartstudy.planner.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller exposing Authentication endpoints.
 *
 * Base path (from application.properties context-path /api):
 *   POST /api/auth/register — create a new student account
 *   POST /api/auth/login    — verify credentials and return student profile
 *
 * @CrossOrigin(origins = "*") allows the React frontend (localhost:5173) to
 * call these endpoints without a CORS error.
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Register a new student.
     *
     * Request body (JSON):
     * {
     *   "fullName": "Jane Doe",
     *   "email": "jane@university.edu",
     *   "password": "securePassword123"
     * }
     *
     * Response (201 Created):
     * {
     *   "id": 2,
     *   "fullName": "Jane Doe",
     *   "email": "jane@university.edu",
     *   ...
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Log in an existing student.
     *
     * Request body (JSON):
     * {
     *   "email": "alex.morgan@university.edu",
     *   "password": "password123"
     * }
     *
     * Response (200 OK):
     * {
     *   "id": 1,
     *   "fullName": "Alex Morgan",
     *   "email": "alex.morgan@university.edu",
     *   ...
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Global error handler for auth-specific IllegalArgumentExceptions
     * (wrong password, email not found, duplicate email).
     * Returns HTTP 401 with a JSON error message.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleAuthError(IllegalArgumentException ex) {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", ex.getMessage()));
    }
}

