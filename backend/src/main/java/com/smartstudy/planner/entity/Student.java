package com.smartstudy.planner.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a Student in the Smart Study Planner system.
 *
 * Table: students
 * Columns: id, full_name, email, password, course, semester,
 *          target_gpa, streak_days, weekly_goal_hours,
 *          completed_hours_this_week, created_at, updated_at
 *
 * Relationships:
 * - One-to-Many with Subject: A student can enroll in multiple subjects.
 * - One-to-Many with StudyTask: A student can plan multiple study tasks.
 */
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 'full_name' column as required; mapped via 'name' field
    @Column(name = "full_name", nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    // BCrypt-hashed password — never stored in plain text
    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 150)
    private String course;

    @Column(nullable = false, length = 50)
    private String semester;

    @Column(name = "target_gpa")
    private Double targetGpa;

    @Column(name = "streak_days")
    private Integer streakDays = 0;

    @Column(name = "weekly_goal_hours")
    private Double weeklyGoalHours = 20.0;

    @Column(name = "completed_hours_this_week")
    private Double completedHoursThisWeek = 0.0;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subject> subjects = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudyTask> studyTasks = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Student() {
    }

    public Student(String name, String email, String course, String semester, Double targetGpa) {
        this.name = name;
        this.email = email;
        this.course = course;
        this.semester = semester;
        this.targetGpa = targetGpa;
        // Default secure hashed password if not provided explicitly
        this.password = "$2a$10$e7V.L2K83v7wWf/1P12Uf.Kz6hK6l9aP1W4Bv7Mv2oZ1iK4Xz8y8q";
        this.streakDays = 0;
        this.weeklyGoalHours = 20.0;
        this.completedHoursThisWeek = 0.0;
    }

    /** Constructor used by AuthService when registering a new student. */
    public Student(String name, String email, String hashedPassword, String course, String semester) {
        this.name = name;
        this.email = email;
        this.password = hashedPassword;
        this.course = course;
        this.semester = semester;
        this.streakDays = 0;
        this.weeklyGoalHours = 20.0;
        this.completedHoursThisWeek = 0.0;
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

    // Bidirectional helper methods
    public void addSubject(Subject subject) {
        subjects.add(subject);
        subject.setStudent(this);
    }

    public void removeSubject(Subject subject) {
        subjects.remove(subject);
        subject.setStudent(null);
    }

    public void addStudyTask(StudyTask task) {
        studyTasks.add(task);
        task.setStudent(this);
    }

    public void removeStudyTask(StudyTask task) {
        studyTasks.remove(task);
        task.setStudent(null);
    }

    // Getters and Setters
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

    public String getFullName() {
        return name;
    }

    public void setFullName(String fullName) {
        this.name = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public List<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<Subject> subjects) {
        this.subjects = subjects;
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

