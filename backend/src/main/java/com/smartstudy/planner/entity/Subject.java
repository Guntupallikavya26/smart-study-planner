package com.smartstudy.planner.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing an academic Subject/Course.
 *
 * Relationships:
 * - Many-to-One with Student: Belongs to one student.
 * - One-to-Many with Topic: Contains a syllabus breakdown into multiple topics.
 * - One-to-Many with StudyTask: Study tasks can be linked directly to this subject.
 */
@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String code; // e.g. "CS201"

    @Column(nullable = false, length = 150)
    private String name; // e.g. "Data Structures & Algorithms"

    @Column(length = 20)
    private String color = "#6366f1"; // UI theme color

    @Column(name = "bg_light", length = 20)
    private String bgLight = "#eef2ff";

    @Column(length = 100)
    private String instructor;

    @Column(length = 30)
    private String difficulty = "Medium"; // "Easy", "Medium", "Hard"

    @Column(name = "current_unit", length = 150)
    private String currentUnit;

    @Column(name = "exam_date")
    private LocalDate examDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Topic> topics = new ArrayList<>();

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<StudyTask> studyTasks = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Subject() {
    }

    public Subject(String code, String name, String instructor, String difficulty, LocalDate examDate) {
        this.code = code;
        this.name = name;
        this.instructor = instructor;
        this.difficulty = difficulty;
        this.examDate = examDate;
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

    // Bidirectional helper methods for topics
    public void addTopic(Topic topic) {
        topics.add(topic);
        topic.setSubject(this);
    }

    public void removeTopic(Topic topic) {
        topics.remove(topic);
        topic.setSubject(null);
    }

    // Helper methods for calculations
    public int getTotalTopicsCount() {
        return topics.size();
    }

    public long getCompletedTopicsCount() {
        return topics.stream().filter(Topic::isCompleted).count();
    }

    public long getPendingTopicsCount() {
        return getTotalTopicsCount() - getCompletedTopicsCount();
    }

    public int getProgressPercentage() {
        if (topics.isEmpty()) {
            return 0;
        }
        return (int) Math.round(((double) getCompletedTopicsCount() / topics.size()) * 100);
    }

    // Getters and Setters
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

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public List<Topic> getTopics() {
        return topics;
    }

    public void setTopics(List<Topic> topics) {
        this.topics = topics;
    }

    public List<StudyTask> getStudyTasks() {
        return studyTasks;
    }

    public void setStudyTasks(List<StudyTask> studyTasks) {
        this.studyTasks = studyTasks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

