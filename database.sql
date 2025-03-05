-- Create Database
CREATE DATABASE higher_applicant_studies;

-- Use Database
USE higher_applicant_studies;

-- Users Table
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Corrected AUTO_INCREMENT placement for MySQL
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications Table
CREATE TABLE application (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Corrected AUTO_INCREMENT placement for MySQL
    user_id INT NOT NULL,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    contact_number VARCHAR(20),
    gender VARCHAR(10),
    final_percentage FLOAT,
    tentative_ranking VARCHAR(20),
    final_year_project TEXT,
    other_projects TEXT,
    publications TEXT,
    extracurricular TEXT,
    professional_experience TEXT,
    strong_points TEXT,
    weak_points TEXT,
    transcript VARCHAR(200),
    cv VARCHAR(200),
    photo VARCHAR(200),
    preferred_programs TEXT,
    `references` TEXT,
    statement_of_purpose TEXT,
    intended_research_areas TEXT,
    english_proficiency VARCHAR(50),
    leadership_experience TEXT,
    availability_to_start VARCHAR(50),
    additional_certifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create index for better performance
CREATE INDEX idx_application_user_id ON application(user_id);

-- Create default admin user
INSERT INTO user (email, password, is_admin, created_at) 
VALUES (
    'admin@example.com', 
    '260000$yE2Xo1Z8t4Eq0b0B$3d084f6176c893ce7fc4d54add90ce67c49ed49fb3a6d89b5fb65a68a98ef3e3',
    TRUE, 
    '2025-03-05 18:23:53'
);
