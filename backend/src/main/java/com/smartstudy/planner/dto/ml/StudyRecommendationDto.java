package com.smartstudy.planner.dto.ml;

/**
 * DTO representing an AI/ML Prescriptive Study Recommendation.
 */
public class StudyRecommendationDto {

    private String title;
    private String category; // "urgent_revision", "schedule_adjustment", "habit_building", "mastery"
    private String priority; // "high", "medium", "info"
    private String action;
    private String subjectCode;

    public StudyRecommendationDto() {
    }

    public StudyRecommendationDto(String title, String category, String priority, String action, String subjectCode) {
        this.title = title;
        this.category = category;
        this.priority = priority;
        this.action = action;
        this.subjectCode = subjectCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }
}

