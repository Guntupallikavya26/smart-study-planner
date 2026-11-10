package com.smartstudy.planner.dto.ml;

/**
 * Request payload for the Interactive Performance Simulator.
 */
public class SimulationRequestDto {

    private Double weeklyStudyHours;
    private Double topicCompletionRatio;
    private Double attendanceRate;
    private Integer streakDays;
    private Integer pendingTasks;
    private Double hardTopicMastery;
    private Double avgSessionDuration;

    public SimulationRequestDto() {
    }

    public Double getWeeklyStudyHours() {
        return weeklyStudyHours;
    }

    public void setWeeklyStudyHours(Double weeklyStudyHours) {
        this.weeklyStudyHours = weeklyStudyHours;
    }

    public Double getTopicCompletionRatio() {
        return topicCompletionRatio;
    }

    public void setTopicCompletionRatio(Double topicCompletionRatio) {
        this.topicCompletionRatio = topicCompletionRatio;
    }

    public Double getAttendanceRate() {
        return attendanceRate;
    }

    public void setAttendanceRate(Double attendanceRate) {
        this.attendanceRate = attendanceRate;
    }

    public Integer getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public Integer getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(Integer pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public Double getHardTopicMastery() {
        return hardTopicMastery;
    }

    public void setHardTopicMastery(Double hardTopicMastery) {
        this.hardTopicMastery = hardTopicMastery;
    }

    public Double getAvgSessionDuration() {
        return avgSessionDuration;
    }

    public void setAvgSessionDuration(Double avgSessionDuration) {
        this.avgSessionDuration = avgSessionDuration;
    }
}

