package com.smartstudy.planner.dto;

/**
 * Response returned to the client after a successful login or registration.
 *
 * Fields:
 *   id       — the database primary key (useful for future API calls)
 *   fullName — display name shown in the UI
 *   email    — student's email
 *   course   — enrolled course/programme
 *   semester — current semester
 *   message  — human-readable confirmation message
 *
 * Note: password is intentionally NEVER included in this response.
 */
public class AuthResponse {

    private Long id;
    private String fullName;
    private String email;
    private String course;
    private String semester;
    private String message;

    public AuthResponse() {}

    public AuthResponse(Long id, String fullName, String email,
                        String course, String semester, String message) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.course = course;
        this.semester = semester;
        this.message = message;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

