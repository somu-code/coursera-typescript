CREATE DATABASE IF NOT EXISTS e-learning-application;
\connect e-learning-application;
CREATE SCHEMA test;
SET search_path TO test;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    delete BOOLEAN DEFAULT false
)