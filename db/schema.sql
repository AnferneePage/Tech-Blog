DROP DATABASE IF EXISTS techblog_db;
CREATE DATABASE techblog_db;

-- Users table to store user information
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Blog posts table to store blog post information
CREATE TABLE BlogPosts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    contents TEXT NOT NULL,
    creator_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES Users(id)
);

-- Comments table to store comments on blog posts
CREATE TABLE Comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    creator_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES BlogPosts(id),
    FOREIGN KEY (creator_id) REFERENCES Users(id)
);
