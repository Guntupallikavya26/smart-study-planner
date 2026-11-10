package com.smartstudy.planner.dto.ml;

/**
 * DTO representing Weak Subject Diagnostic from ML Service.
 * Scores vulnerability based on topic completion, difficulty, and exam proximity.
 */
public class WeakSubjectDto {

    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private Double vulnerabilityScore; // 0.0 - 100.0 (Higher means weaker / more critical)
    private String urgencyLevel;        // "Critical", "Moderate", "Normal"
    private Double completionRatio;     // 0.0 - 1.0
    private Integer totalTopics;
    private Integer completedTopics;
    private Integer incompleteHardTopics;
    private String primaryReason;

    public WeakSubjectDto() {
    }

    public WeakSubjectDto(Long subjectId, String subjectName, String subjectCode,
                          Double vulnerabilityScore, String urgencyLevel, Double completionRatio,
                          Integer totalTopics, Integer completedTopics, Integer incompleteHardTopics,
                          String primaryReason) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.vulnerabilityScore = vulnerabilityScore;
        this.urgencyLevel = urgencyLevel;
        this.completionRatio = completionRatio;
        this.totalTopics = totalTopics;
        this.completedTopics = completedTopics;
        this.incompleteHardTopics = incompleteHardTopics;
        this.primaryReason = primaryReason;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public Double getVulnerabilityScore() {
        return vulnerabilityScore;
    }

    public void setVulnerabilityScore(Double vulnerabilityScore) {
        this.vulnerabilityScore = vulnerabilityScore;
    }

    public String getUrgencyLevel() {
        return urgencyLevel;
    }

    public void setUrgencyLevel(String urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }

    public Double getCompletionRatio() {
        return completionRatio;
    }

    public void setCompletionRatio(Double completionRatio) {
        this.completionRatio = completionRatio;
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

    public Integer getIncompleteHardTopics() {
        return incompleteHardTopics;
    }

    public void setIncompleteHardTopics(Integer incompleteHardTopics) {
        this.incompleteHardTopics = incompleteHardTopics;
    }

    public String getPrimaryReason() {
        return primaryReason;
    }

    public void setPrimaryReason(String primaryReason) {
        this.primaryReason = primaryReason;
    }
}

