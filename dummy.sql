CREATE DATABASE dummy_db;
USE dummy_db;

CREATE TABLE USERS(
  user_rollno varchar(100) UNIQUE NOT NULL,
  user_password varchar(100) NOT NULL,
  PRIMARY KEY (user_rollno)
);