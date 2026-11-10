package com.smartstudy.planner.dto.ml;

/**
 * Response payload for the Interactive Performance Simulator.
 */
public class SimulationResponseDto {

    private Double predictedExamScore;
    private Double predictedGpa;
    private String riskLevel;
    private Double confidence;

    public SimulationResponseDto() {
    }

    public SimulationResponseDto(Double predictedExamScore, Double predictedGpa, String riskLevel, Double confidence) {
        this.predictedExamScore = predictedExamScore;
        this.predictedGpa = predictedGpa;
        this.riskLevel = riskLevel;
        this.confidence = confidence;
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
}

