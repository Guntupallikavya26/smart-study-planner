package com.smartstudy.planner.service;

import com.smartstudy.planner.dto.SubjectDto;
import com.smartstudy.planner.dto.TopicDto;
import com.smartstudy.planner.entity.Student;
import com.smartstudy.planner.repository.StudentRepository;
import com.smartstudy.planner.repository.SubjectRepository;
import com.smartstudy.planner.repository.TopicRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
public class SubjectAndTopicServiceTest {

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private TopicService topicService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TopicRepository topicRepository;

    private Student studentA;
    private Student studentB;

    @BeforeEach
    void setUp() {
        studentA = new Student("Alice", "alice.sub@university.edu", "pass123", "CS", "Sem 4");
        studentA = studentRepository.save(studentA);

        studentB = new Student("Bob", "bob.sub@university.edu", "pass123", "IT", "Sem 2");
        studentB = studentRepository.save(studentB);
    }

    @Test
    @DisplayName("Create, edit, and delete Subject with student isolation")
    void testSubjectCrudAndIsolation() {
        // 1. Create Subject for Student A
        SubjectDto subjectDto = new SubjectDto();
        subjectDto.setCode("CS301");
        subjectDto.setName("Database Systems");
        subjectDto.setInstructor("Dr. Stone");
        subjectDto.setDifficulty("Hard");
        subjectDto.setExamDate(LocalDate.now().plusDays(20));
        subjectDto.setStudentId(studentA.getId());

        SubjectDto created = subjectService.createSubject(subjectDto);
        assertThat(created.getId()).isNotNull();
        assertThat(created.getName()).isEqualTo("Database Systems");

        // 2. Student A has this subject, but Student B does NOT
        List<SubjectDto> studentASubjects = subjectService.getSubjectsByStudentId(studentA.getId());
        List<SubjectDto> studentBSubjects = subjectService.getSubjectsByStudentId(studentB.getId());

        assertThat(studentASubjects).hasSize(1);
        assertThat(studentASubjects.get(0).getCode()).isEqualTo("CS301");
        assertThat(studentBSubjects).isEmpty(); // Student isolation enforced!

        // 3. Edit Subject
        created.setName("Advanced Database Management");
        created.setDifficulty("Medium");
        SubjectDto updated = subjectService.updateSubject(created.getId(), created);
        assertThat(updated.getName()).isEqualTo("Advanced Database Management");
        assertThat(updated.getDifficulty()).isEqualTo("Medium");

        // 4. Delete Subject
        subjectService.deleteSubject(created.getId());
        assertThat(subjectService.getSubjectsByStudentId(studentA.getId())).isEmpty();
    }

    @Test
    @DisplayName("Add multiple topics with difficulty & status, and calculate completion metrics")
    void testTopicManagementAndCompletionCalculation() {
        // 1. Create Subject
        SubjectDto subjectDto = new SubjectDto();
        subjectDto.setCode("CS302");
        subjectDto.setName("Algorithms");
        subjectDto.setInstructor("Dr. Knuth");
        subjectDto.setDifficulty("Hard");
        subjectDto.setExamDate(LocalDate.now().plusDays(15));
        subjectDto.setStudentId(studentA.getId());
        SubjectDto savedSubject = subjectService.createSubject(subjectDto);

        // 2. Add Topic 1: Easy, Completed
        TopicDto t1 = new TopicDto();
        t1.setTitle("Sorting & Binary Search");
        t1.setDifficulty("Easy");
        t1.setStatus("Completed");
        t1.setCompleted(true);
        t1.setSubjectId(savedSubject.getId());
        topicService.createTopic(t1);

        // 3. Add Topic 2: Medium, In Progress
        TopicDto t2 = new TopicDto();
        t2.setTitle("Divide and Conquer");
        t2.setDifficulty("Medium");
        t2.setStatus("In Progress");
        t2.setCompleted(false);
        t2.setSubjectId(savedSubject.getId());
        topicService.createTopic(t2);

        // 4. Add Topic 3: Hard, Not Started
        TopicDto t3 = new TopicDto();
        t3.setTitle("Dynamic Programming & Memoization");
        t3.setDifficulty("Hard");
        t3.setStatus("Not Started");
        t3.setCompleted(false);
        t3.setSubjectId(savedSubject.getId());
        TopicDto savedT3 = topicService.createTopic(t3);

        // 5. Verify topics are returned subject-wise
        List<TopicDto> topics = topicService.getTopicsBySubjectId(savedSubject.getId());
        assertThat(topics).hasSize(3);
        assertThat(topics.get(0).getDifficulty()).isEqualTo("Easy");
        assertThat(topics.get(0).getStatus()).isEqualTo("Completed");
        assertThat(topics.get(1).getStatus()).isEqualTo("In Progress");
        assertThat(topics.get(2).getStatus()).isEqualTo("Not Started");

        // 6. Verify subject-wise calculation
        SubjectDto retrievedSubject = subjectService.getSubjectById(savedSubject.getId());
        assertThat(retrievedSubject.getTotalTopics()).isEqualTo(3);
        assertThat(retrievedSubject.getCompletedTopics()).isEqualTo(1);
        assertThat(retrievedSubject.getPendingTopics()).isEqualTo(2);
        // 1/3 * 100 = 33%
        assertThat(retrievedSubject.getProgressPercentage()).isEqualTo(33);

        // 7. Toggle Topic 3 to completed and recheck percentage
        topicService.toggleTopicCompletion(savedT3.getId());
        SubjectDto updatedSubject = subjectService.getSubjectById(savedSubject.getId());
        assertThat(updatedSubject.getCompletedTopics()).isEqualTo(2);
        assertThat(updatedSubject.getProgressPercentage()).isEqualTo(67); // 2/3 * 100 = 67%
    }
}

