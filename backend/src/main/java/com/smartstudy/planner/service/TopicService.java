package com.smartstudy.planner.service;

import com.smartstudy.planner.dto.TopicDto;
import com.smartstudy.planner.entity.Subject;
import com.smartstudy.planner.entity.Topic;
import com.smartstudy.planner.exception.ResourceNotFoundException;
import com.smartstudy.planner.repository.SubjectRepository;
import com.smartstudy.planner.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling business logic for Topics (Syllabus chapters).
 */
@Service
@Transactional
public class TopicService {

    private final TopicRepository topicRepository;
    private final SubjectRepository subjectRepository;

    public TopicService(TopicRepository topicRepository, SubjectRepository subjectRepository) {
        this.topicRepository = topicRepository;
        this.subjectRepository = subjectRepository;
    }

    public TopicDto createTopic(TopicDto dto) {
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", dto.getSubjectId()));

        Topic topic = new Topic(
                dto.getTitle(),
                dto.isCompleted(),
                dto.getOrderIndex() != null ? dto.getOrderIndex() : 0,
                dto.getDifficulty(),
                dto.getStatus()
        );
        subject.addTopic(topic);

        Topic saved = topicRepository.save(topic);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<TopicDto> getTopicsBySubjectId(Long subjectId) {
        if (!subjectRepository.existsById(subjectId)) {
            throw new ResourceNotFoundException("Subject", "id", subjectId);
        }
        return topicRepository.findBySubjectIdOrderByOrderIndexAsc(subjectId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TopicDto toggleTopicCompletion(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", topicId));

        topic.setCompleted(!topic.isCompleted());
        Topic updated = topicRepository.save(topic);
        return mapToDto(updated);
    }

    public TopicDto updateTopic(Long id, TopicDto dto) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", id));

        topic.setTitle(dto.getTitle());
        if (dto.getDifficulty() != null) {
            topic.setDifficulty(dto.getDifficulty());
        }
        if (dto.getStatus() != null) {
            topic.setStatus(dto.getStatus());
        } else {
            topic.setCompleted(dto.isCompleted());
        }
        if (dto.getOrderIndex() != null) {
            topic.setOrderIndex(dto.getOrderIndex());
        }

        Topic updated = topicRepository.save(topic);
        return mapToDto(updated);
    }

    public void deleteTopic(Long id) {
        if (!topicRepository.existsById(id)) {
            throw new ResourceNotFoundException("Topic", "id", id);
        }
        topicRepository.deleteById(id);
    }

    public TopicDto mapToDto(Topic topic) {
        return new TopicDto(
                topic.getId(),
                topic.getTitle(),
                topic.isCompleted(),
                topic.getDifficulty(),
                topic.getStatus(),
                topic.getOrderIndex(),
                topic.getSubject() != null ? topic.getSubject().getId() : null
        );
    }
}

