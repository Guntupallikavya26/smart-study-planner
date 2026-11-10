# Smart Study Planner - Spring Boot Backend 🚀

A clean, enterprise-structured **Spring Boot 3.3.5** REST API backend running on **Java 21**, built with **Maven**, **Spring Data JPA**, and **MySQL**.

---

## 🏗 Architecture & Package Structure

The backend follows the standard layered enterprise pattern:

```
backend/
├── pom.xml                                  # Maven dependencies (Spring Web, JPA, Validation, MySQL)
├── mvnw / mvnw.cmd                          # Maven Wrapper scripts
└── src/
    └── main/
        ├── resources/
        │   └── application.properties       # MySQL connection, JPA & server configuration
        └── java/com/smartstudy/planner/
            ├── SmartStudyPlannerApplication.java # Spring Boot entry point
            │
            ├── entity/                      # JPA Entities (Database Tables & Mappings)
            │   ├── Priority.java            # Enum: LOW, MEDIUM, HIGH
            │   ├── Student.java             # Student entity with GPA, streaks, and hour goals
            │   ├── Subject.java             # Course entity with instructor, difficulty, exams
            │   ├── Topic.java               # Syllabus topics/chapters with completion toggle
            │   └── StudyTask.java           # Scheduled study sessions with time, duration, priority
            │
            ├── repository/                  # Spring Data JPA Repositories (Data Access)
            │   ├── StudentRepository.java   # CRUD + findByEmail, existsByEmail
            │   ├── SubjectRepository.java   # CRUD + findByStudentId, existsByCodeAndStudentId
            │   ├── TopicRepository.java     # CRUD + findBySubjectIdOrderByOrderIndexAsc
            │   └── StudyTaskRepository.java # CRUD + findByStudentIdAndScheduledDate
            │
            ├── dto/                         # Data Transfer Objects (Payloads & Validation)
            │   ├── StudentDto.java          # Student input/output with Bean Validation
            │   ├── SubjectDto.java          # Subject input/output with computed progress stats
            │   ├── TopicDto.java            # Topic input/output
            │   └── StudyTaskDto.java        # Study task input/output with joined subject metadata
            │
            ├── service/                     # Business Logic Layer
            │   ├── StudentService.java      # Student profile logic & DTO transformations
            │   ├── SubjectService.java      # Subject syllabus tracking & progress metrics
            │   ├── TopicService.java        # Topic completion toggling & ordering
            │   └── StudyTaskService.java    # Task planning, daily filters, & toggle logic
            │
            ├── controller/                  # REST API Controllers (HTTP Endpoints)
            │   ├── StudentController.java   # /api/students endpoints
            │   ├── SubjectController.java   # /api/subjects endpoints
            │   ├── TopicController.java     # /api/topics endpoints
            │   └── StudyTaskController.java # /api/tasks endpoints
            │
            ├── exception/                   # Error Handling & REST Responses
            │   ├── ResourceNotFoundException.java # HTTP 404 handler
            │   ├── ErrorResponse.java       # Unified JSON error schema
            │   └── GlobalExceptionHandler.java # Centralized @RestControllerAdvice
            │
            └── config/                      # Configuration & Seed Data
                └── DataSeeder.java          # Automatic initial database seeder (Alex Morgan + 5 subjects)
```

---

## 🗄 Entity Relationships

- **Student 1 ──< N Subject**: A student enrolls in multiple courses. Cascade type `ALL` ensures child removal when a student is deleted.
- **Student 1 ──< N StudyTask**: A student creates multiple planned study tasks.
- **Subject 1 ──< N Topic**: A subject contains a syllabus broken into ordered topics.
- **Subject 1 ──< N StudyTask**: Study tasks can optionally link directly to a course.

---

## 🔌 REST API Endpoints Overview

Base URL: `http://localhost:8080/api`

### 1. Students (`/api/students`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/students` | Register a new student profile |
| `GET` | `/api/students` | Retrieve all registered students |
| `GET` | `/api/students/{id}` | Retrieve student by ID |
| `PUT` | `/api/students/{id}` | Update student profile, goals, GPA |
| `DELETE` | `/api/students/{id}` | Delete student account |

### 2. Subjects (`/api/subjects`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/subjects` | Add a new course/subject |
| `GET` | `/api/subjects/{id}` | Get subject details with completion stats |
| `GET` | `/api/subjects/student/{studentId}` | List all subjects for a student |
| `PUT` | `/api/subjects/{id}` | Update subject details |
| `DELETE` | `/api/subjects/{id}` | Delete a subject and its topics |

### 3. Topics (`/api/topics`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/topics` | Add a topic to a subject's syllabus |
| `GET` | `/api/topics/subject/{subjectId}` | List all topics for a course |
| `PATCH` | `/api/topics/{id}/toggle` | Toggle completion status (done/pending) |
| `PUT` | `/api/topics/{id}` | Edit topic title/order |
| `DELETE` | `/api/topics/{id}` | Delete a topic |

### 4. Study Tasks (`/api/tasks`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tasks` | Schedule a new study session/task |
| `GET` | `/api/tasks/student/{studentId}` | List all tasks for a student |
| `GET` | `/api/tasks/student/{studentId}/today` | Get today's study plan tasks |
| `PATCH` | `/api/tasks/{id}/toggle` | Mark task completed / pending |
| `PUT` | `/api/tasks/{id}` | Update task details |
| `DELETE` | `/api/tasks/{id}` | Delete a task |

---

## ⚙️ Running the Backend

### Prerequisites
- **Java 21** installed (`java -version`).
- **MySQL Server** running on port `3306`.
- Create a MySQL database (or let Hibernate create it automatically with `createDatabaseIfNotExist=true` in `application.properties`).

### Commands

1. **Compile with Maven:**
   ```powershell
   ./mvnw clean compile
   ```
   Or if Maven is on PATH:
   ```powershell
   mvn clean compile
   ```

2. **Run Application:**
   ```powershell
   ./mvnw spring-boot:run
   ```

3. **Package to JAR:**
   ```powershell
   ./mvnw clean package
   java -jar target/smart-study-planner-backend-0.0.1-SNAPSHOT.jar
   ```

