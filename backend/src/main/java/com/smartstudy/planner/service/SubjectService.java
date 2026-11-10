package com.smartstudy.planner.service;

import com.smartstudy.planner.dto.SubjectDto;
import com.smartstudy.planner.entity.Student;
import com.smartstudy.planner.entity.Subject;
import com.smartstudy.planner.exception.ResourceNotFoundException;
import com.smartstudy.planner.repository.StudentRepository;
import com.smartstudy.planner.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling business logic for Subjects.
 */
@Service
@Transactional
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final com.smartstudy.planner.repository.TopicRepository topicRepository;

    public SubjectService(SubjectRepository subjectRepository,
                          StudentRepository studentRepository,
                          com.smartstudy.planner.repository.TopicRepository topicRepository) {
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
        this.topicRepository = topicRepository;
    }

    public SubjectDto createSubject(SubjectDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", dto.getStudentId()));

        if (subjectRepository.existsByCodeAndStudentId(dto.getCode(), dto.getStudentId())) {
            throw new IllegalArgumentException("Subject with code '" + dto.getCode() + "' already exists for this student");
        }

        Subject subject = new Subject(
                dto.getCode(),
                dto.getName(),
                dto.getInstructor(),
                dto.getDifficulty(),
                dto.getExamDate()
        );

        if (dto.getColor() != null && !dto.getColor().isBlank()) {
            subject.setColor(dto.getColor());
        }
        if (dto.getBgLight() != null && !dto.getBgLight().isBlank()) {
            subject.setBgLight(dto.getBgLight());
        }
        if (dto.getCurrentUnit() != null) {
            subject.setCurrentUnit(dto.getCurrentUnit());
        }

        subject.setStudent(student);
        Subject saved = subjectRepository.save(subject);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public SubjectDto getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));
        return mapToDto(subject);
    }

    @Transactional(readOnly = true)
    public List<SubjectDto> getSubjectsByStudentId(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }
        return subjectRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public SubjectDto updateSubject(Long id, SubjectDto dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));

        subject.setName(dto.getName());
        subject.setCode(dto.getCode());

        if (dto.getInstructor() != null) {
            subject.setInstructor(dto.getInstructor());
        }
        if (dto.getDifficulty() != null) {
            subject.setDifficulty(dto.getDifficulty());
        }
        if (dto.getColor() != null) {
            subject.setColor(dto.getColor());
        }
        if (dto.getBgLight() != null) {
            subject.setBgLight(dto.getBgLight());
        }
        if (dto.getCurrentUnit() != null) {
            subject.setCurrentUnit(dto.getCurrentUnit());
        }
        if (dto.getExamDate() != null) {
            subject.setExamDate(dto.getExamDate());
        }

        Subject updated = subjectRepository.save(subject);
        return mapToDto(updated);
    }

    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject", "id", id);
        }
        subjectRepository.deleteById(id);
    }

    public SubjectDto mapToDto(Subject subject) {
        SubjectDto dto = new SubjectDto();
        dto.setId(subject.getId());
        dto.setCode(subject.getCode());
        dto.setName(subject.getName());
        dto.setColor(subject.getColor());
        dto.setBgLight(subject.getBgLight());
        dto.setInstructor(subject.getInstructor());
        dto.setDifficulty(subject.getDifficulty());
        dto.setCurrentUnit(subject.getCurrentUnit());
        dto.setExamDate(subject.getExamDate());
        dto.setStudentId(subject.getStudent() != null ? subject.getStudent().getId() : null);

        // Fetch authoritative topic list from topicRepository
        List<com.smartstudy.planner.entity.Topic> topicsList =
                topicRepository.findBySubjectIdOrderByOrderIndexAsc(subject.getId());

        int total = topicsList.size();
        long completed = topicsList.stream().filter(com.smartstudy.planner.entity.Topic::isCompleted).count();
        long pending = total - completed;
        int pct = total > 0 ? (int) Math.round(((double) completed / total) * 100) : 0;

        dto.setTotalTopics(total);
        dto.setCompletedTopics((int) completed);
        dto.setPendingTopics((int) pending);
        dto.setProgressPercentage(pct);

        List<com.smartstudy.planner.dto.TopicDto> topicDtos = topicsList.stream()
                .map(t -> new com.smartstudy.planner.dto.TopicDto(
                        t.getId(),
                        t.getTitle(),
                        t.isCompleted(),
                        t.getDifficulty(),
                        t.getStatus(),
                        t.getOrderIndex(),
                        subject.getId()
                ))
                .collect(Collectors.toList());
        dto.setTopics(topicDtos);

        return dto;
    }
}

