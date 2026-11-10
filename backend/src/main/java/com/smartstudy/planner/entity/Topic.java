package com.smartstudy.planner.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing an individual Topic / Chapter within a Subject's syllabus.
 *
 * Relationship:
 * - Many-to-One with Subject: Every topic belongs to a specific subject.
 */
@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "is_completed", nullable = false)
    private boolean completed = false;

    @Column(length = 20)
    private String difficulty = "Medium"; // "Easy", "Medium", "Hard"

    @Column(length = 30)
    private String status = "Not Started"; // "Not Started", "In Progress", "Completed"

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Topic() {
    }

    public Topic(String title, boolean completed, Integer orderIndex) {
        this.title = title;
        this.completed = completed;
        this.orderIndex = orderIndex;
        this.status = completed ? "Completed" : "Not Started";
        this.difficulty = "Medium";
    }

    public Topic(String title, boolean completed, Integer orderIndex, String difficulty, String status) {
        this.title = title;
        this.completed = completed || "Completed".equalsIgnoreCase(status);
        this.orderIndex = orderIndex;
        this.difficulty = difficulty != null ? difficulty : "Medium";
        this.status = status != null ? status : (completed ? "Completed" : "Not Started");
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

