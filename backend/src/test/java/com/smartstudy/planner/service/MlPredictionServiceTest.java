package com.smartstudy.planner.service;

import com.smartstudy.planner.dto.ml.MlInsightsResponse;
import com.smartstudy.planner.dto.ml.SimulationRequestDto;
import com.smartstudy.planner.dto.ml.SimulationResponseDto;
import com.smartstudy.planner.entity.Priority;
import com.smartstudy.planner.entity.Student;
import com.smartstudy.planner.entity.StudyTask;
import com.smartstudy.planner.entity.Subject;
import com.smartstudy.planner.entity.Topic;
import com.smartstudy.planner.repository.StudentRepository;
import com.smartstudy.planner.repository.StudyTaskRepository;
import com.smartstudy.planner.repository.SubjectRepository;
import com.smartstudy.planner.repository.TopicRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class MlPredictionServiceTest {

    @Autowired
    private MlPredictionService mlPredictionService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private StudyTaskRepository studyTaskRepository;

    private Student testStudent;

    @BeforeEach
    void setUp() {
        testStudent = new Student("ML Tester", "mltester@example.com", "Password123!", "CS", "Sem 4");
        testStudent = studentRepository.save(testStudent);

        Subject math = new Subject("MATH301", "Applied Mathematics", "Dr. Gauss", "Hard", LocalDate.now().plusDays(20));
        math.setStudent(testStudent);
        math = subjectRepository.save(math);

        Topic t1 = new Topic("Differential Equations", true, 1, "Hard", "Completed");
        t1.setSubject(math);
        topicRepository.save(t1);

        Topic t2 = new Topic("Matrix Decompositions", false, 2, "Hard", "Not Started");
        t2.setSubject(math);
        topicRepository.save(t2);

        Subject cs = new Subject("CS401", "Distributed Systems", "Dr. Lamport", "Hard", LocalDate.now().plusDays(15));
        cs.setStudent(testStudent);
        cs = subjectRepository.save(cs);

        Topic t3 = new Topic("Raft Consensus Algorithm", false, 1, "Hard", "In Progress");
        t3.setSubject(cs);
        topicRepository.save(t3);

        StudyTask task1 = new StudyTask("Practice Differential Equations", LocalDate.now(), "10:00 AM", 60, Priority.HIGH);
        task1.setStudent(testStudent);
        task1.setSubject(math);
        studyTaskRepository.save(task1);
    }

    @Test
    @DisplayName("Should generate complete ML insights for student with prediction, weak subjects, and recommendations")
    void testGetStudentInsights() {
        MlInsightsResponse response = mlPredictionService.getStudentInsights(testStudent.getId());

        assertNotNull(response);
        assertEquals(testStudent.getId(), response.getStudentId());
        assertEquals(testStudent.getFullName(), response.getStudentName());

        // Verify Performance Prediction
        assertNotNull(response.getPrediction());
        assertTrue(response.getPrediction().getPredictedExamScore() >= 40.0 && response.getPrediction().getPredictedExamScore() <= 100.0);
        assertTrue(response.getPrediction().getPredictedGpa() >= 1.5 && response.getPrediction().getPredictedGpa() <= 4.0);
        assertNotNull(response.getPrediction().getRiskLevel());

        // Verify Weak Subjects
        assertNotNull(response.getWeakSubjects());
        assertFalse(response.getWeakSubjects().isEmpty());
        assertTrue(response.getWeakSubjects().get(0).getVulnerabilityScore() > 0);

        // Verify Recommendations
        assertNotNull(response.getRecommendations());
        assertFalse(response.getRecommendations().isEmpty());

        // Verify Progress Analytics
        assertNotNull(response.getProgressAnalysis());
        assertTrue(response.getProgressAnalysis().getMomentumScore() >= 0);
    }

    @Test
    @DisplayName("Should simulate performance with dynamic study hours and completion sliders")
    void testSimulatePerformance() {
        SimulationRequestDto request = new SimulationRequestDto();
        request.setWeeklyStudyHours(26.0);
        request.setTopicCompletionRatio(0.85);
        request.setStreakDays(8);

        SimulationResponseDto result = mlPredictionService.simulatePerformance(request);

        assertNotNull(result);
        assertTrue(result.getPredictedExamScore() >= 70.0, "High study hours and completion ratio should yield >= 70 score");
        assertTrue(result.getPredictedGpa() >= 2.5, "High study hours should predict GPA >= 2.5");
        assertNotNull(result.getRiskLevel());
    }
}
