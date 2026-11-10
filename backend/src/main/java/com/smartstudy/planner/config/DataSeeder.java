package com.smartstudy.planner.config;

import com.smartstudy.planner.entity.Priority;
import com.smartstudy.planner.entity.Student;
import com.smartstudy.planner.entity.StudyTask;
import com.smartstudy.planner.entity.Subject;
import com.smartstudy.planner.entity.Topic;
import com.smartstudy.planner.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;

/**
 * Automatically seeds the database with initial sample data (student, subjects, topics, tasks)
 * upon application startup if the database is currently empty.
 *
 * The demo student's password ("password123") is BCrypt-hashed before saving,
 * so it is stored securely in MySQL — never as plain text.
 */
@Configuration
public class DataSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public DataSeeder(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        if (studentRepository.count() > 0) {
            return; // Data already exists, skip seeding
        }

        // 1. Create demo Student with a BCrypt-hashed password
        // Plain-text: "password123"  →  stored as BCrypt hash in MySQL
        String hashedPassword = passwordEncoder.encode("password123");

        Student student = new Student(
                "Alex Morgan",
                "alex.morgan@university.edu",
                hashedPassword,                           // ← BCrypt hash
                "B.Tech Computer Science & Engineering",
                "Semester 4"
        );
        student.setTargetGpa(3.9);
        student.setStreakDays(7);
        student.setWeeklyGoalHours(25.0);
        student.setCompletedHoursThisWeek(18.5);

        // 2. Create Subjects
        Subject dsa = new Subject("CS201", "Data Structures & Algorithms", "Dr. Sarah Jenkins", "Hard", LocalDate.now().plusDays(6));
        dsa.setColor("#6366f1");
        dsa.setBgLight("#eef2ff");
        dsa.setCurrentUnit("Dynamic Programming & Graphs");

        dsa.addTopic(new Topic("Arrays & Two-Pointer Techniques", true, 1));
        dsa.addTopic(new Topic("Singly & Doubly Linked Lists", true, 2));
        dsa.addTopic(new Topic("Stack Applications & Queues", true, 3));
        dsa.addTopic(new Topic("Binary Trees & BST Traversals", true, 4));
        dsa.addTopic(new Topic("AVL Trees & Balanced Trees", true, 5));
        dsa.addTopic(new Topic("Graph BFS & DFS Algorithms", true, 6));
        dsa.addTopic(new Topic("Dijkstra's Shortest Path", true, 7));
        dsa.addTopic(new Topic("0/1 Knapsack & Unbounded Knapsack", false, 8));
        dsa.addTopic(new Topic("Segment Tree & Range Sum Queries", false, 9));

        Subject os = new Subject("CS202", "Operating Systems", "Prof. Alan Turing", "Medium", LocalDate.now().plusDays(10));
        os.setColor("#0ea5e9");
        os.setBgLight("#f0f9ff");
        os.setCurrentUnit("Memory Management & Paging");

        os.addTopic(new Topic("Process Life Cycle & States", true, 1));
        os.addTopic(new Topic("CPU Scheduling Algorithms", true, 2));
        os.addTopic(new Topic("Deadlock Conditions & Banker's Algorithm", true, 3));
        os.addTopic(new Topic("Paging & Multi-Level Page Tables", true, 4));
        os.addTopic(new Topic("Virtual Memory & Demand Paging", false, 5));
        os.addTopic(new Topic("Page Replacement Algorithms (FIFO/LRU)", false, 6));

        Subject dbms = new Subject("CS203", "Database Management Systems", "Dr. Edgar Codd", "Medium", LocalDate.now().plusDays(14));
        dbms.setColor("#10b981");
        dbms.setBgLight("#ecfdf5");
        dbms.setCurrentUnit("Transaction Concurrency & ACID");

        dbms.addTopic(new Topic("Relational Data Model & ER Diagrams", true, 1));
        dbms.addTopic(new Topic("SQL Complex Queries & Joins", true, 2));
        dbms.addTopic(new Topic("Normalization (1NF, 2NF, 3NF, BCNF)", true, 3));
        dbms.addTopic(new Topic("B+ Tree Indexing & Search", true, 4));
        dbms.addTopic(new Topic("ACID Properties & Transactions", false, 5));

        Subject cn = new Subject("CS204", "Computer Networks", "Prof. Radia Perlman", "Hard", LocalDate.now().plusDays(19));
        cn.setColor("#f59e0b");
        cn.setBgLight("#fffbeb");
        cn.setCurrentUnit("Transport Layer Protocols");

        cn.addTopic(new Topic("OSI & TCP/IP Reference Models", true, 1));
        cn.addTopic(new Topic("IPv4 Addressing & Subnetting", true, 2));
        cn.addTopic(new Topic("Routing Protocols: OSPF & BGP", false, 3));
        cn.addTopic(new Topic("TCP 3-Way Handshake & Flow Control", false, 4));

        Subject dm = new Subject("MA201", "Discrete Mathematics", "Dr. Paul Erdős", "Hard", LocalDate.now().plusDays(25));
        dm.setColor("#8b5cf6");
        dm.setBgLight("#f5f3ff");
        dm.setCurrentUnit("Combinatorics & Recurrence");

        dm.addTopic(new Topic("Propositional Logic & Proof Methods", true, 1));
        dm.addTopic(new Topic("Mathematical Induction", true, 2));
        dm.addTopic(new Topic("Pigeonhole Principle", false, 3));
        dm.addTopic(new Topic("Recurrence Relations & Generating Functions", false, 4));

        student.addSubject(dsa);
        student.addSubject(os);
        student.addSubject(dbms);
        student.addSubject(cn);
        student.addSubject(dm);

        // 3. Create Study Tasks
        StudyTask task1 = new StudyTask("Practice Dijkstra's & Bellman-Ford Problems", LocalDate.now(), "09:30 AM", 60, Priority.HIGH);
        task1.setCompleted(true);
        task1.setSubject(dsa);

        StudyTask task2 = new StudyTask("Read Chapter 8: Virtual Memory & Page Tables", LocalDate.now(), "11:15 AM", 45, Priority.MEDIUM);
        task2.setCompleted(true);
        task2.setSubject(os);

        StudyTask task3 = new StudyTask("Write SQL Joins & Subqueries Assignment", LocalDate.now(), "02:00 PM", 90, Priority.HIGH);
        task3.setCompleted(false);
        task3.setSubject(dbms);

        StudyTask task4 = new StudyTask("Revise TCP vs UDP header structure", LocalDate.now(), "04:30 PM", 30, Priority.LOW);
        task4.setCompleted(false);
        task4.setSubject(cn);

        StudyTask task5 = new StudyTask("Solve 5 Recurrence Relation Proofs", LocalDate.now(), "07:00 PM", 45, Priority.MEDIUM);
        task5.setCompleted(false);
        task5.setSubject(dm);

        student.addStudyTask(task1);
        student.addStudyTask(task2);
        student.addStudyTask(task3);
        student.addStudyTask(task4);
        student.addStudyTask(task5);

        // Saving student cascades to subjects, topics, and studyTasks
        studentRepository.save(student);
    }
}

