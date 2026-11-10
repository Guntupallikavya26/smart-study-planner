package com.smartstudy.planner.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for Student requests and responses.
 */
public class StudentDto {

    private Long id;

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Course is required")
    private String course;

    @NotBlank(message = "Semester is required")
    private String semester;

    private Double targetGpa;
    private Integer streakDays;
    private Double weeklyGoalHours;
    private Double completedHoursThisWeek;

    public StudentDto() {
    }

    public StudentDto(Long id, String name, String email, String course, String semester, Double targetGpa, Integer streakDays, Double weeklyGoalHours, Double completedHoursThisWeek) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.course = course;
        this.semester = semester;
        this.targetGpa = targetGpa;
        this.streakDays = streakDays;
        this.weeklyGoalHours = weeklyGoalHours;
        this.completedHoursThisWeek = completedHoursThisWeek;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public Double getTargetGpa() {
        return targetGpa;
    }

    public void setTargetGpa(Double targetGpa) {
        this.targetGpa = targetGpa;
    }

    public Integer getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public Double getWeeklyGoalHours() {
        return weeklyGoalHours;
    }

    public void setWeeklyGoalHours(Double weeklyGoalHours) {
        this.weeklyGoalHours = weeklyGoalHours;
    }

    public Double getCompletedHoursThisWeek() {
        return completedHoursThisWeek;
    }

    public void setCompletedHoursThisWeek(Double completedHoursThisWeek) {
        this.completedHoursThisWeek = completedHoursThisWeek;
    }
}

