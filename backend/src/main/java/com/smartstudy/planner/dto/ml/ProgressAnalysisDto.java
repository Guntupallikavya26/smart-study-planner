package com.smartstudy.planner.dto.ml;

/**
 * DTO representing Study Progress & Momentum Analytics from ML Service.
 */
public class ProgressAnalysisDto {

    private Double momentumScore;      // 0.0 - 100.0
    private String consistencyRating;  // "Consistent", "Building Momentum", "Irregular", "At Risk"
    private String burnoutRisk;        // "Low", "Moderate", "Elevated"
    private Double retentionEfficiency;// 0.0 - 100.0
    private Double weeklyCompletedHours;
    private Double completionRate;
    private Integer streakDays;
    private String summary;

    public ProgressAnalysisDto() {
    }

    public ProgressAnalysisDto(Double momentumScore, String consistencyRating, String burnoutRisk,
                               Double retentionEfficiency, Double weeklyCompletedHours,
                               Double completionRate, Integer streakDays, String summary) {
        this.momentumScore = momentumScore;
        this.consistencyRating = consistencyRating;
        this.burnoutRisk = burnoutRisk;
        this.retentionEfficiency = retentionEfficiency;
        this.weeklyCompletedHours = weeklyCompletedHours;
        this.completionRate = completionRate;
        this.streakDays = streakDays;
        this.summary = summary;
    }

    public Double getMomentumScore() {
        return momentumScore;
    }

    public void setMomentumScore(Double momentumScore) {
        this.momentumScore = momentumScore;
    }

    public String getConsistencyRating() {
        return consistencyRating;
    }

    public void setConsistencyRating(String consistencyRating) {
        this.consistencyRating = consistencyRating;
    }

    public String getBurnoutRisk() {
        return burnoutRisk;
    }

    public void setBurnoutRisk(String burnoutRisk) {
        this.burnoutRisk = burnoutRisk;
    }

    public Double getRetentionEfficiency() {
        return retentionEfficiency;
    }

    public void setRetentionEfficiency(Double retentionEfficiency) {
        this.retentionEfficiency = retentionEfficiency;
    }

    public Double getWeeklyCompletedHours() {
        return weeklyCompletedHours;
    }

    public void setWeeklyCompletedHours(Double weeklyCompletedHours) {
        this.weeklyCompletedHours = weeklyCompletedHours;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Integer getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}

