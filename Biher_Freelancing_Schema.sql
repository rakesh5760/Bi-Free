-- Database Creation
CREATE DATABASE IF NOT EXISTS Biher_Freelancing;
USE Biher_Freelancing;

-- ==============================================================================
-- 1. USERS & ROLES SCHEMA
-- ==============================================================================

CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

-- ==============================================================================
-- 2. EXTENDED PROFILES SCHEMA
-- ==============================================================================

CREATE TABLE Student_Profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    incubation_level ENUM('D', 'C', 'B', 'A') DEFAULT 'D',
    trust_score DECIMAL(5,2) DEFAULT 0.00,
    github_handle VARCHAR(100),
    portfolio_url VARCHAR(255),
    skills JSON,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Mentor_Profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    expertise_area VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Client_Profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ==============================================================================
-- 3. PROJECT & ALLOCATION SCHEMA
-- ==============================================================================

CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    budget DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Assigned', 'In Progress', 'Mentor QA', 'Completed') DEFAULT 'Pending',
    required_skills JSON,
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Client_Profiles(profile_id)
);

CREATE TABLE Project_Allocations (
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL UNIQUE,
    mentor_id INT NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES Mentor_Profiles(profile_id)
);

CREATE TABLE Team_Members (
    team_member_id INT AUTO_INCREMENT PRIMARY KEY,
    allocation_id INT NOT NULL,
    student_id INT NOT NULL,
    role VARCHAR(100),
    FOREIGN KEY (allocation_id) REFERENCES Project_Allocations(allocation_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Student_Profiles(profile_id)
);

-- ==============================================================================
-- 4. KANBAN & DELIVERABLES SCHEMA
-- ==============================================================================

CREATE TABLE Tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    assigned_to INT,
    title VARCHAR(255) NOT NULL,
    status ENUM('To Do', 'In Progress', 'Review', 'Done') DEFAULT 'To Do',
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    github_pr_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES Student_Profiles(profile_id)
);

CREATE TABLE Quality_Assurance_Submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    submitted_by INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    status ENUM('Pending', 'Mentor Approved', 'Client Reviewed', 'Rejected') DEFAULT 'Pending',
    asset_url VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (submitted_by) REFERENCES Student_Profiles(profile_id)
);

-- ==============================================================================
-- SEED DATA INSERTIONS
-- ==============================================================================

-- Seed Roles
INSERT INTO Roles (role_name) VALUES ('Faculty'), ('Mentor'), ('Student'), ('Client');

-- Seed Users (Passwords are hashed mock values)
INSERT INTO Users (role_id, first_name, last_name, email, password_hash) VALUES 
(4, 'TechStart', 'Corp', 'admin@techstart.com', 'hash123'),
(4, 'DesignHub', 'Inc', 'hello@designhub.com', 'hash123'),
(2, 'Sarah', 'Kumar', 'sarah.k@skillforge.edu', 'hash123'),
(2, 'Rajesh', 'Mehta', 'rajesh.m@skillforge.edu', 'hash123'),
(2, 'Vikram', 'Reddy', 'vikram.r@skillforge.edu', 'hash123'),
(3, 'Priya', 'Sharma', 'priya.s@student.edu', 'hash123'),
(3, 'Rahul', 'Singh', 'rahul.s@student.edu', 'hash123'),
(3, 'Anjali', 'Patel', 'anjali.p@student.edu', 'hash123'),
(1, 'Admin', 'Faculty', 'admin@skillforge.edu', 'hash123');

-- Seed Profiles
INSERT INTO Client_Profiles (user_id, company_name, industry, total_spent) VALUES 
(1, 'TechStart Corp', 'E-commerce', 12450.00),
(2, 'DesignHub Inc', 'Software UI', 3200.00);

INSERT INTO Mentor_Profiles (user_id, expertise_area, rating, total_reviews) VALUES 
(3, 'Backend Architecture', 4.8, 45),
(4, 'Full Stack Development', 4.9, 32),
(5, 'Mobile App UI/UX', 4.7, 28);

INSERT INTO Student_Profiles (user_id, incubation_level, trust_score, skills) VALUES 
(6, 'A', 92.5, '["React", "Node.js"]'),
(7, 'B', 85.0, '["Python", "Django"]'),
(8, 'B', 72.0, '["Figma", "Tailwind"]');

-- Seed Projects
INSERT INTO Projects (client_id, title, budget, status, required_skills, deadline) VALUES 
(1, 'E-commerce Backend Refactor', 4500.00, 'In Progress', '["Node.js", "PostgreSQL"]', '2026-05-18'),
(2, 'Mobile App UI/UX Design', 2800.00, 'Mentor QA', '["React Native", "Figma"]', '2026-05-25');

-- Seed Allocations & Teams
INSERT INTO Project_Allocations (project_id, mentor_id, team_name) VALUES 
(1, 1, 'Team Alpha'),
(2, 3, 'Team Beta');

INSERT INTO Team_Members (allocation_id, student_id, role) VALUES 
(1, 1, 'Backend Lead'),
(1, 2, 'DevOps'),
(2, 3, 'Frontend Lead');

-- Seed Tasks (Kanban Board Mock Data)
INSERT INTO Tasks (project_id, assigned_to, title, status, priority) VALUES 
(1, 1, 'Design homepage mockup', 'To Do', 'High'),
(1, 2, 'Set up database schema', 'To Do', 'High'),
(1, 1, 'Implement user authentication', 'In Progress', 'High'),
(1, 2, 'Shopping cart functionality', 'Review', 'High');

-- Seed Deliverables
INSERT INTO Quality_Assurance_Submissions (project_id, submitted_by, title, status) VALUES 
(1, 1, 'E-commerce Backend API', 'Mentor Approved'),
(2, 3, 'Mobile Wireframes v2', 'Pending');
