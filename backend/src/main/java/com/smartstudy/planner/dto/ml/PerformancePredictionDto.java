package com.smartstudy.planner.dto.ml;

import java.util.Map;

/**
 * DTO representing Student Performance Prediction from ML Model.
 * Contains predicted exam score, GPA, academic risk level, confidence, and feature drivers.
 */
public class PerformancePredictionDto {

    private Double predictedExamScore;
    private Double predictedGpa;
    private String riskLevel; // "Low", "Medium", "High"
    private Double confidence;
    private String statusMessage;
    private Map<String, Object> keyDrivers;

    public PerformancePredictionDto() {
    }

    public PerformancePredictionDto(Double predictedExamScore, Double predictedGpa, String riskLevel,
                                    Double confidence, String statusMessage, Map<String, Object> keyDrivers) {
        this.predictedExamScore = predictedExamScore;
        this.predictedGpa = predictedGpa;
        this.riskLevel = riskLevel;
        this.confidence = confidence;
        this.statusMessage = statusMessage;
        this.keyDrivers = keyDrivers;
    }

    public Double getPredictedExamScore() {
        return predictedExamScore;
    }

    public void setPredictedExamScore(Double predictedExamScore) {
        this.predictedExamScore = predictedExamScore;
    }

    public Double getPredictedGpa() {
        return predictedGpa;
    }

    public void setPredictedGpa(Double predictedGpa) {
        this.predictedGpa = predictedGpa;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }

    public Map<String, Object> getKeyDrivers() {
        return keyDrivers;
    }

    public void setKeyDrivers(Map<String, Object> keyDrivers) {
        this.keyDrivers = keyDrivers;
    }
}

