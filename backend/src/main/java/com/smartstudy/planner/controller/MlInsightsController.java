package com.smartstudy.planner.controller;

import com.smartstudy.planner.dto.ml.MlInsightsResponse;
import com.smartstudy.planner.dto.ml.SimulationRequestDto;
import com.smartstudy.planner.dto.ml.SimulationResponseDto;
import com.smartstudy.planner.service.MlPredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller exposing AI & Machine Learning insights for students.
 *
 * Endpoints:
 * - GET /api/ml/student/{studentId}/insights : Fetches student performance prediction, weak subjects,
 *                                             recommendations, and momentum progress analytics.
 * - POST /api/ml/simulate : Real-time simulator computing predicted exam score and GPA based
 *                           on dynamic user sliders.
 */
@RestController
@RequestMapping("/ml")
@CrossOrigin(origins = "*")
public class MlInsightsController {

    private final MlPredictionService mlPredictionService;

    public MlInsightsController(MlPredictionService mlPredictionService) {
        this.mlPredictionService = mlPredictionService;
    }

    /**
     * Get complete ML insights for a student.
     */
    @GetMapping("/student/{studentId}/insights")
    public ResponseEntity<MlInsightsResponse> getStudentInsights(@PathVariable Long studentId) {
        MlInsightsResponse response = mlPredictionService.getStudentInsights(studentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Run simulated prediction for what-if scenarios (e.g. adjusting weekly study hours).
     */
    @PostMapping("/simulate")
    public ResponseEntity<SimulationResponseDto> simulatePerformance(@RequestBody SimulationRequestDto request) {
        SimulationResponseDto response = mlPredictionService.simulatePerformance(request);
        return ResponseEntity.ok(response);
    }
}

