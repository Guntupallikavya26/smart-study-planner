package com.smartstudy.planner.controller;

import com.smartstudy.planner.dto.StudyTaskDto;
import com.smartstudy.planner.service.StudyTaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing API endpoints for Study Task management.
 */
@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class StudyTaskController {

    private final StudyTaskService studyTaskService;

    public StudyTaskController(StudyTaskService studyTaskService) {
        this.studyTaskService = studyTaskService;
    }

    @PostMapping
    public ResponseEntity<StudyTaskDto> createStudyTask(@Valid @RequestBody StudyTaskDto dto) {
        StudyTaskDto created = studyTaskService.createStudyTask(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudyTaskDto>> getTasksByStudentId(@PathVariable Long studentId) {
        List<StudyTaskDto> tasks = studyTaskService.getTasksByStudentId(studentId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/student/{studentId}/today")
    public ResponseEntity<List<StudyTaskDto>> getTodayTasks(@PathVariable Long studentId) {
        List<StudyTaskDto> tasks = studyTaskService.getTodayTasks(studentId);
        return ResponseEntity.ok(tasks);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<StudyTaskDto> toggleTaskCompletion(@PathVariable Long id) {
        StudyTaskDto updated = studyTaskService.toggleTaskCompletion(id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyTaskDto> updateStudyTask(@PathVariable Long id, @Valid @RequestBody StudyTaskDto dto) {
        StudyTaskDto updated = studyTaskService.updateStudyTask(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudyTask(@PathVariable Long id) {
        studyTaskService.deleteStudyTask(id);
        return ResponseEntity.noContent().build();
    }
}

