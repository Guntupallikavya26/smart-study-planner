package com.smartstudy.planner.dto.ml;

import java.util.List;

/**
 * Composite response containing complete Data Science and Machine Learning insights
 * for a student's dashboard.
 */
public class MlInsightsResponse {

    private Long studentId;
    private String studentName;
    private PerformancePredictionDto prediction;
    private List<WeakSubjectDto> weakSubjects;
    private List<StudyRecommendationDto> recommendations;
    private ProgressAnalysisDto progressAnalysis;
    private boolean mlServiceOnline;

    public MlInsightsResponse() {
    }

    public MlInsightsResponse(Long studentId, String studentName, PerformancePredictionDto prediction,
                              List<WeakSubjectDto> weakSubjects, List<StudyRecommendationDto> recommendations,
                              ProgressAnalysisDto progressAnalysis, boolean mlServiceOnline) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.prediction = prediction;
        this.weakSubjects = weakSubjects;
        this.recommendations = recommendations;
        this.progressAnalysis = progressAnalysis;
        this.mlServiceOnline = mlServiceOnline;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public PerformancePredictionDto getPrediction() {
        return prediction;
    }

    public void setPrediction(PerformancePredictionDto prediction) {
        this.prediction = prediction;
    }

    public List<WeakSubjectDto> getWeakSubjects() {
        return weakSubjects;
    }

    public void setWeakSubjects(List<WeakSubjectDto> weakSubjects) {
        this.weakSubjects = weakSubjects;
    }

    public List<StudyRecommendationDto> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<StudyRecommendationDto> recommendations) {
        this.recommendations = recommendations;
    }

    public ProgressAnalysisDto getProgressAnalysis() {
        return progressAnalysis;
    }

    public void setProgressAnalysis(ProgressAnalysisDto progressAnalysis) {
        this.progressAnalysis = progressAnalysis;
    }

    public boolean isMlServiceOnline() {
        return mlServiceOnline;
    }

    public void setMlServiceOnline(boolean mlServiceOnline) {
        this.mlServiceOnline = mlServiceOnline;
    }
}

