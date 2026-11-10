package com.smartstudy.planner.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartstudy.planner.dto.AuthResponse;
import com.smartstudy.planner.dto.LoginRequest;
import com.smartstudy.planner.dto.RegisterRequest;
import com.smartstudy.planner.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("POST /auth/register returns 201 Created and safe AuthResponse")
    void testRegisterEndpoint() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("John Smith");
        request.setEmail("john@university.edu");
        request.setPassword("securePassword123");

        AuthResponse authResponse = new AuthResponse(
                1L, "John Smith", "john@university.edu", "Student", "Semester 1", "Registration successful!"
        );

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.fullName").value("John Smith"))
                .andExpect(jsonPath("$.email").value("john@university.edu"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("POST /auth/login returns 200 OK on valid credentials")
    void testLoginEndpointSuccess() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("alex.morgan@university.edu");
        request.setPassword("password123");

        AuthResponse authResponse = new AuthResponse(
                1L, "Alex Morgan", "alex.morgan@university.edu", "B.Tech CS", "Semester 4", "Login successful!"
        );

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Alex Morgan"))
                .andExpect(jsonPath("$.email").value("alex.morgan@university.edu"));
    }

    @Test
    @DisplayName("POST /auth/login returns 401 Unauthorized on invalid credentials")
    void testLoginEndpointFailure() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("alex.morgan@university.edu");
        request.setPassword("wrongPassword");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new IllegalArgumentException("Invalid email or password."));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password."));
    }
}

