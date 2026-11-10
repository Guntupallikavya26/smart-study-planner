package com.smartstudy.planner.service;

import com.smartstudy.planner.dto.StudyTaskDto;
import com.smartstudy.planner.entity.Student;
import com.smartstudy.planner.entity.StudyTask;
import com.smartstudy.planner.entity.Subject;
import com.smartstudy.planner.exception.ResourceNotFoundException;
import com.smartstudy.planner.repository.StudentRepository;
import com.smartstudy.planner.repository.StudyTaskRepository;
import com.smartstudy.planner.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling business logic for Study Tasks.
 */
@Service
@Transactional
public class StudyTaskService {

    private final StudyTaskRepository studyTaskRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public StudyTaskService(StudyTaskRepository studyTaskRepository,
                            StudentRepository studentRepository,
                            SubjectRepository subjectRepository) {
        this.studyTaskRepository = studyTaskRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
    }

    public StudyTaskDto createStudyTask(StudyTaskDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", dto.getStudentId()));

        Subject subject = null;
        if (dto.getSubjectId() != null) {
            subject = subjectRepository.findById(dto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", dto.getSubjectId()));
        }

        StudyTask task = new StudyTask(
                dto.getTitle(),
                dto.getScheduledDate() != null ? dto.getScheduledDate() : LocalDate.now(),
                dto.getScheduledTime(),
                dto.getDurationMinutes(),
                dto.getPriority()
        );
        task.setCompleted(dto.isCompleted());
        task.setStudent(student);
        task.setSubject(subject);

        StudyTask saved = studyTaskRepository.save(task);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<StudyTaskDto> getTasksByStudentId(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }
        return studyTaskRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudyTaskDto> getTodayTasks(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }
        return studyTaskRepository.findByStudentIdAndScheduledDate(studentId, LocalDate.now()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StudyTaskDto toggleTaskCompletion(Long taskId) {
        StudyTask task = studyTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("StudyTask", "id", taskId));

        task.setCompleted(!task.isCompleted());
        StudyTask updated = studyTaskRepository.save(task);
        return mapToDto(updated);
    }

    public StudyTaskDto updateStudyTask(Long id, StudyTaskDto dto) {
        StudyTask task = studyTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudyTask", "id", id));

        task.setTitle(dto.getTitle());
        task.setCompleted(dto.isCompleted());

        if (dto.getScheduledDate() != null) {
            task.setScheduledDate(dto.getScheduledDate());
        }
        if (dto.getScheduledTime() != null) {
            task.setScheduledTime(dto.getScheduledTime());
        }
        if (dto.getDurationMinutes() != null) {
            task.setDurationMinutes(dto.getDurationMinutes());
        }
        if (dto.getPriority() != null) {
            task.setPriority(dto.getPriority());
        }

        if (dto.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(dto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", dto.getSubjectId()));
            task.setSubject(subject);
        }

        StudyTask updated = studyTaskRepository.save(task);
        return mapToDto(updated);
    }

    public void deleteStudyTask(Long id) {
        if (!studyTaskRepository.existsById(id)) {
            throw new ResourceNotFoundException("StudyTask", "id", id);
        }
        studyTaskRepository.deleteById(id);
    }

    public StudyTaskDto mapToDto(StudyTask task) {
        StudyTaskDto dto = new StudyTaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setScheduledDate(task.getScheduledDate());
        dto.setScheduledTime(task.getScheduledTime());
        dto.setDurationMinutes(task.getDurationMinutes());
        dto.setPriority(task.getPriority());
        dto.setCompleted(task.isCompleted());
        dto.setStudentId(task.getStudent() != null ? task.getStudent().getId() : null);

        if (task.getSubject() != null) {
            dto.setSubjectId(task.getSubject().getId());
            dto.setSubjectCode(task.getSubject().getCode());
            dto.setSubjectName(task.getSubject().getName());
        }

        return dto;
    }
}

