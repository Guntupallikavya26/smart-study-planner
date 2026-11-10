package com.smartstudy.planner.service;

import com.smartstudy.planner.dto.StudentDto;
import com.smartstudy.planner.entity.Student;
import com.smartstudy.planner.exception.ResourceNotFoundException;
import com.smartstudy.planner.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling business logic for Students.
 */
@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public StudentDto createStudent(StudentDto dto) {
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Student with email '" + dto.getEmail() + "' already exists");
        }

        Student student = new Student(
                dto.getName(),
                dto.getEmail(),
                dto.getCourse(),
                dto.getSemester(),
                dto.getTargetGpa()
        );

        if (dto.getWeeklyGoalHours() != null) {
            student.setWeeklyGoalHours(dto.getWeeklyGoalHours());
        }
        if (dto.getStreakDays() != null) {
            student.setStreakDays(dto.getStreakDays());
        }

        Student saved = studentRepository.save(student);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return mapToDto(student);
    }

    @Transactional(readOnly = true)
    public StudentDto getStudentByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "email", email));
        return mapToDto(student);
    }

    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StudentDto updateStudent(Long id, StudentDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        student.setName(dto.getName());
        student.setCourse(dto.getCourse());
        student.setSemester(dto.getSemester());

        if (dto.getTargetGpa() != null) {
            student.setTargetGpa(dto.getTargetGpa());
        }
        if (dto.getWeeklyGoalHours() != null) {
            student.setWeeklyGoalHours(dto.getWeeklyGoalHours());
        }
        if (dto.getStreakDays() != null) {
            student.setStreakDays(dto.getStreakDays());
        }
        if (dto.getCompletedHoursThisWeek() != null) {
            student.setCompletedHoursThisWeek(dto.getCompletedHoursThisWeek());
        }

        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student", "id", id);
        }
        studentRepository.deleteById(id);
    }

    public StudentDto mapToDto(Student student) {
        return new StudentDto(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getCourse(),
                student.getSemester(),
                student.getTargetGpa(),
                student.getStreakDays(),
                student.getWeeklyGoalHours(),
                student.getCompletedHoursThisWeek()
        );
    }
}

