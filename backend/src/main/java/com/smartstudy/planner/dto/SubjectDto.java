package com.smartstudy.planner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * Data Transfer Object for Subject operations.
 */
public class SubjectDto {

    private Long id;

    @NotBlank(message = "Subject code is required (e.g. CS201)")
    @Size(max = 30, message = "Code must not exceed 30 characters")
    private String code;

    @NotBlank(message = "Subject name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String name;

    private String color = "#6366f1";
    private String bgLight = "#eef2ff";
    private String instructor;
    private String difficulty = "Medium";
    private String currentUnit;
    private LocalDate examDate;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    // Derived statistics included in responses
    private Integer totalTopics = 0;
    private Integer completedTopics = 0;
    private Integer pendingTopics = 0;
    private Integer progressPercentage = 0;

    // Associated topics for this subject
    private java.util.List<TopicDto> topics = new java.util.ArrayList<>();

    public SubjectDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getBgLight() {
        return bgLight;
    }

    public void setBgLight(String bgLight) {
        this.bgLight = bgLight;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getCurrentUnit() {
        return currentUnit;
    }

    public void setCurrentUnit(String currentUnit) {
        this.currentUnit = currentUnit;
    }

    public LocalDate getExamDate() {
        return examDate;
    }

    public void setExamDate(LocalDate examDate) {
        this.examDate = examDate;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Integer getTotalTopics() {
        return totalTopics;
    }

    public void setTotalTopics(Integer totalTopics) {
        this.totalTopics = totalTopics;
    }

    public Integer getCompletedTopics() {
        return completedTopics;
    }

    public void setCompletedTopics(Integer completedTopics) {
        this.completedTopics = completedTopics;
    }

    public Integer getPendingTopics() {
        return pendingTopics;
    }

    public void setPendingTopics(Integer pendingTopics) {
        this.pendingTopics = pendingTopics;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public java.util.List<TopicDto> getTopics() {
        return topics;
    }

    public void setTopics(java.util.List<TopicDto> topics) {
        this.topics = topics != null ? topics : new java.util.ArrayList<>();
    }
}

