# SkillForge Database Schema Documentation

This document provides a comprehensive overview of all tables in the database, including their purpose and attributes. The schema uses SQLAlchemy models, and most tables inherit common timestamp (`created_at`, `updated_at`) and soft-delete (`deleted_at`) attributes.

---

## 1. Core Models (`core.py`)

### `domains`
Represents high-level categories or fields of study/work (e.g., Web Development, Data Science).
- `domain_id` (Primary Key, Integer): Unique identifier.
- `name` (String): The name of the domain.
- `description` (Text): Details about the domain.
- *Common: created_at, updated_at, deleted_at*

### `skills`
Specific technical skills tied to a domain (e.g., React, Python).
- `skill_id` (Primary Key, Integer): Unique identifier.
- `domain_id` (Foreign Key, Integer): Links to `domains`.
- `name` (String): The skill name.
- *Common: created_at, updated_at, deleted_at*

### `levels`
Defines the proficiency levels (e.g., Level D, Level A) for students.
- `level_id` (Primary Key, Integer): Unique identifier.
- `name` (String): Name of the level.
- `description` (Text): Details of level requirements.
- `required_trust_score` (Numeric): The minimum trust score needed for this level.
- *Common: created_at, updated_at, deleted_at*

---

## 2. User & Authentication Models (`user.py`)

### `roles`
Defines the different types of users in the system.
- `role_id` (Primary Key, Integer): Unique identifier.
- `role_name` (String): Name of the role (e.g., student, mentor, client).
- *Common: created_at, updated_at, deleted_at*

### `users`
The core authentication and identity table for all users.
- `user_id` (Primary Key, Integer): Unique identifier.
- `role_id` (Foreign Key, Integer): Links to `roles`.
- `first_name` (String): User's first name.
- `last_name` (String): User's last name.
- `email` (String): User's email address (used for login).
- `password_hash` (String): Encrypted password.
- `phone_number` (String, Optional): Contact number.
- `is_active` (Boolean): Whether the account is active or suspended.
- *Common: created_at, updated_at, deleted_at*

---

## 3. Profiles Models (`profile.py`)

### `student_profiles`
Stores student-specific information.
- `profile_id` (Primary Key, Integer): Unique identifier.
- `user_id` (Foreign Key, Integer): Links to `users`.
- `level_id` (Foreign Key, Integer, Optional): Links to `levels` defining current rank.
- `trust_score` (Numeric): The student's reputation/trust score.
- `github_handle` (String, Optional): GitHub username.
- `portfolio_url` (String, Optional): Link to personal portfolio.
- *Common: created_at, updated_at, deleted_at*

### `mentor_profiles`
Stores mentor-specific information.
- `profile_id` (Primary Key, Integer): Unique identifier.
- `user_id` (Foreign Key, Integer): Links to `users`.
- `domain_id` (Foreign Key, Integer, Optional): Domain of expertise.
- `rating` (Numeric): Overall mentor rating.
- `total_reviews` (Integer): Count of reviews received.
- *Common: created_at, updated_at, deleted_at*

### `client_profiles`
Stores client/company specific information.
- `profile_id` (Primary Key, Integer): Unique identifier.
- `user_id` (Foreign Key, Integer): Links to `users`.
- `domain_id` (Foreign Key, Integer, Optional): Primary domain of interest.
- `company_name` (String): Name of the client's company.
- `total_spent` (Numeric): Total money spent on platform projects.
- *Common: created_at, updated_at, deleted_at*

### `faculty_profiles`
Stores faculty/administrative supervisor information.
- `profile_id` (Primary Key, Integer): Unique identifier.
- `user_id` (Foreign Key, Integer): Links to `users`.
- `department` (String, Optional): The department they belong to.
- *Common: created_at, updated_at, deleted_at*

### `admin_profiles`
Stores platform administrator information.
- `profile_id` (Primary Key, Integer): Unique identifier.
- `user_id` (Foreign Key, Integer): Links to `users`.
- `department` (String, Optional): The administrative department.
- *Common: created_at, updated_at, deleted_at*

### `student_skills` (Association Table)
Many-to-many link between students and skills.
- `student_id` (Primary/Foreign Key, Integer)
- `skill_id` (Primary/Foreign Key, Integer)

---

## 4. Learning & Incubation Models (`learning.py`)

### `learning_paths`
Curriculums assigned to domains.
- `path_id` (Primary Key, Integer): Unique identifier.
- `title` (String): Path title.
- `description` (Text): Overview of the path.
- `domain_id` (Foreign Key, Integer): Links to `domains`.
- *Common: created_at, updated_at, deleted_at*

### `milestones`
Steps within a learning path.
- `milestone_id` (Primary Key, Integer): Unique identifier.
- `path_id` (Foreign Key, Integer): Links to `learning_paths`.
- `title` (String): Milestone title.
- `order_index` (Integer): Sequence order within the path.
- *Common: created_at, updated_at, deleted_at*

### `learning_resources`
Educational materials.
- `resource_id` (Primary Key, Integer): Unique identifier.
- `title` (String): Title of the resource.
- `url` (String): Link to the material.
- `resource_type` (Enum): Type (Video, Article, Course, Documentation).
- `domain_id` (Foreign Key, Integer): Links to `domains`.
- `level_id` (Foreign Key, Integer): Links to `levels`.
- *Common: created_at, updated_at, deleted_at*

### `milestone_resources` (Association Table)
Links resources to specific milestones.
- `milestone_id` (Primary/Foreign Key, Integer)
- `resource_id` (Primary/Foreign Key, Integer)

### `assignments`
Tasks given to students during learning.
- `assignment_id` (Primary Key, Integer): Unique identifier.
- `milestone_id` (Foreign Key, Integer): Links to `milestones`.
- `title` (String): Assignment title.
- `description` (Text): Details of what to do.
- `assignment_type` (Enum): Expected submission (GitHub PR, File Upload, External Link).
- *Common: created_at, updated_at, deleted_at*

### `quizzes`
Assessments tied to milestones.
- `quiz_id` (Primary Key, Integer): Unique identifier.
- `milestone_id` (Foreign Key, Integer): Links to `milestones`.
- `title` (String): Quiz title.
- `passing_score` (Integer): Required score to pass.
- `questions` (JSON): The quiz questions and options.
- *Common: created_at, updated_at, deleted_at*

### `student_progress`
Tracks student completion of learning items.
- `progress_id` (Primary Key, Integer): Unique identifier.
- `student_id` (Foreign Key, Integer): Links to `student_profiles`.
- `item_id` (Integer): Polymorphic ID referencing assignment, quiz, or path.
- `item_type` (String): Defines the type of item (Assignment, Quiz, LearningPath).
- `status` (Enum): Status (Not Started, In Progress, Pending Review, Completed, Rejected).
- `score` (Integer, Optional): Score achieved.
- `submission_url` (String, Optional): Link to submitted work.
- `feedback` (Text, Optional): Reviewer feedback.
- *Common: created_at, updated_at, deleted_at*

---

## 5. Project Execution Models (`project.py`)

### `projects`
Client-requested projects.
- `project_id` (Primary Key, Integer): Unique identifier.
- `client_id` (Foreign Key, Integer): Links to `client_profiles`.
- `domain_id` (Foreign Key, Integer): Links to `domains`.
- `title` (String): Project title.
- `description` (Text): Project requirements.
- `budget` (Numeric): Project budget.
- `status` (Enum): Current state (Pending, Assigned, In Progress, Mentor QA, Completed, Revoked).
- `deadline` (Date): Project deadline.
- `revocation_reason` (Text, Optional): Reason if revoked.
- *Common: created_at, updated_at, deleted_at*

### `project_skills` (Association Table)
Skills required for a project.
- `project_id` (Primary/Foreign Key, Integer)
- `skill_id` (Primary/Foreign Key, Integer)

### `project_allocations`
The mapping of a project to a mentor and a team.
- `allocation_id` (Primary Key, Integer): Unique identifier.
- `project_id` (Foreign Key, Integer, Unique): Links to `projects`.
- `mentor_id` (Foreign Key, Integer): Links to `mentor_profiles`.
- `team_name` (String): Name of the student team.
- *Common: created_at, updated_at, deleted_at*

### `team_members`
Students assigned to a project allocation.
- `team_member_id` (Primary Key, Integer): Unique identifier.
- `allocation_id` (Foreign Key, Integer): Links to `project_allocations`.
- `student_id` (Foreign Key, Integer): Links to `student_profiles`.
- `role` (String): Specific role on the team.
- *Common: created_at, updated_at, deleted_at*

### `tasks`
Individual granular tasks within a project (Kanban issues).
- `task_id` (Primary Key, Integer): Unique identifier.
- `project_id` (Foreign Key, Integer): Links to `projects`.
- `assigned_to` (Foreign Key, Integer, Optional): Links to `student_profiles`.
- `title` (String): Task title.
- `status` (Enum): Task status (To Do, In Progress, Review, Done).
- `priority` (Enum): Task priority (Low, Medium, High).
- `github_pr_url` (String, Optional): Associated PR link.
- *Common: created_at, updated_at, deleted_at*

### `quality_assurance_submissions`
Formal QA submissions from students to mentors/clients.
- `submission_id` (Primary Key, Integer): Unique identifier.
- `project_id` (Foreign Key, Integer): Links to `projects`.
- `submitted_by` (Foreign Key, Integer): Links to `student_profiles`.
- `title` (String): Title of submission.
- `status` (Enum): Status (Pending, Mentor Approved, Client Reviewed, Rejected).
- `asset_url` (String, Optional): Link to the submitted asset/code.
- *Common: created_at, updated_at, deleted_at*

---

## 6. Exam & Certification Models (`exam.py`)

### `exams`
Formal level-up certification exams.
- `exam_id` (Primary Key, Integer): Unique identifier.
- `title` (String): Exam title.
- `description` (Text): Exam details.
- `domain_id` (Foreign Key, Integer): Links to `domains`.
- `duration_minutes` (Integer): Time limit.
- `passing_score` (Integer): Required passing score.
- *Common: created_at, updated_at, deleted_at*

### `questions`
Questions belonging to exams.
- `question_id` (Primary Key, Integer): Unique identifier.
- `exam_id` (Foreign Key, Integer): Links to `exams`.
- `question_type` (Enum): Type (MCQ, Coding).
- `text` (Text): The question text.
- `content` (JSON, Optional): Additional structure (options, test cases).
- `marks` (Integer): Marks awarded for correct answer.
- *Common: created_at, updated_at, deleted_at*

### `exam_attempts`
Records of a student taking an exam.
- `attempt_id` (Primary Key, Integer): Unique identifier.
- `exam_id` (Foreign Key, Integer): Links to `exams`.
- `student_id` (Foreign Key, Integer): Links to `student_profiles`.
- `start_time` (DateTime): Start timestamp.
- `end_time` (DateTime, Optional): End/submission timestamp.
- `score` (Integer, Optional): Achieved score.
- `status` (Enum): Status (In Progress, Submitted, Under Review, Graded).
- `tab_switch_count` (Integer): Counter used for anti-cheat monitoring.
- *Common: created_at, updated_at, deleted_at*

### `monitoring_logs`
Anti-cheat event logs during an exam attempt.
- `log_id` (Primary Key, Integer): Unique identifier.
- `attempt_id` (Foreign Key, Integer): Links to `exam_attempts`.
- `event_type` (Enum): Type of violation (Tab Switch, Fullscreen Exit, Focus Lost, Media Denied).
- `timestamp` (DateTime): When the violation occurred.
- `description` (String, Optional): Additional details.
- *Common: created_at, updated_at* (No soft delete)

### `exam_submissions`
Individual question answers submitted during an attempt.
- `submission_id` (Primary Key, Integer): Unique identifier.
- `attempt_id` (Foreign Key, Integer): Links to `exam_attempts`.
- `question_id` (Foreign Key, Integer): Links to `questions`.
- `answer` (JSON): The student's provided answer.
- `marks_awarded` (Integer, Optional): Marks given by system/reviewer.
- `mentor_feedback` (Text, Optional): Reviewer notes.
- *Common: created_at, updated_at, deleted_at*

---

## 7. Reputation Models (`reputation.py`)

### `student_reviews`
Reviews given to students by mentors or clients.
- `review_id` (Primary Key, Integer): Unique identifier.
- `student_id` (Foreign Key, Integer): Links to `student_profiles`.
- `reviewer_id` (Integer): Identifier of the reviewer user.
- `reviewer_type` (Enum): Whether the reviewer is a Mentor or Client.
- `project_id` (Foreign Key, Integer, Optional): Links to `projects` if the review is project-specific.
- `professionalism_score` (Numeric): Score from 1.0 to 5.0.
- `reliability_score` (Numeric): Score from 1.0 to 5.0.
- `communication_score` (Numeric): Score from 1.0 to 5.0.
- `feedback` (Text, Optional): Written review notes.
- *Common: created_at, updated_at, deleted_at*
