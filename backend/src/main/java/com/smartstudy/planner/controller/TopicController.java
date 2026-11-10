package com.smartstudy.planner.controller;

import com.smartstudy.planner.dto.TopicDto;
import com.smartstudy.planner.service.TopicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing API endpoints for Topic (syllabus chapters) management.
 */
@RestController
@RequestMapping("/topics")
@CrossOrigin(origins = "*")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @PostMapping
    public ResponseEntity<TopicDto> createTopic(@Valid @RequestBody TopicDto dto) {
        TopicDto created = topicService.createTopic(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<TopicDto>> getTopicsBySubjectId(@PathVariable Long subjectId) {
        List<TopicDto> topics = topicService.getTopicsBySubjectId(subjectId);
        return ResponseEntity.ok(topics);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TopicDto> toggleTopicCompletion(@PathVariable Long id) {
        TopicDto updated = topicService.toggleTopicCompletion(id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TopicDto> updateTopic(@PathVariable Long id, @Valid @RequestBody TopicDto dto) {
        TopicDto updated = topicService.updateTopic(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }
}

