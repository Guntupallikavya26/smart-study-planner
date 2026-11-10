package com.smartstudy.planner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for Topic requests and responses.
 */
public class TopicDto {

    private Long id;

    @NotBlank(message = "Topic title is required")
    @Size(max = 200, message = "Topic title must not exceed 200 characters")
    private String title;

    private boolean completed = false;

    private String difficulty = "Medium"; // "Easy", "Medium", "Hard"

    private String status = "Not Started"; // "Not Started", "In Progress", "Completed"

    private Integer orderIndex = 0;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    public TopicDto() {
    }

    public TopicDto(Long id, String title, boolean completed, Integer orderIndex, Long subjectId) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.status = completed ? "Completed" : "Not Started";
        this.difficulty = "Medium";
        this.orderIndex = orderIndex;
        this.subjectId = subjectId;
    }

    public TopicDto(Long id, String title, boolean completed, String difficulty, String status, Integer orderIndex, Long subjectId) {
        this.id = id;
        this.title = title;
        this.completed = completed || "Completed".equalsIgnoreCase(status);
        this.difficulty = difficulty != null ? difficulty : "Medium";
        this.status = status != null ? status : (completed ? "Completed" : "Not Started");
        this.orderIndex = orderIndex;
        this.subjectId = subjectId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed || "Completed".equalsIgnoreCase(status);
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
        if (completed) {
            this.status = "Completed";
        } else if ("Completed".equalsIgnoreCase(this.status)) {
            this.status = "Not Started";
        }
    }

    public String getDifficulty() {
        return difficulty != null ? difficulty : "Medium";
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty != null ? difficulty : "Medium";
    }

    public String getStatus() {
        return status != null ? status : (completed ? "Completed" : "Not Started");
    }

    public void setStatus(String status) {
        this.status = status != null ? status : "Not Started";
        this.completed = "Completed".equalsIgnoreCase(this.status);
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
}

