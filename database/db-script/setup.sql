-- Create a new database
CREATE DATABASE myDB;
GO

-- Use the new database
USE mydb;
GO

-- Create a new schema
CREATE SCHEMA  myschema;
GO

-- Create a new login
CREATE LOGIN myapplogin WITH PASSWORD = 'MyAppPassword';
GO

-- Create a new user for the login
CREATE USER myappuser FOR LOGIN myapplogin WITH DEFAULT_SCHEMA = myschema;
GO

-- Grant permissions to the user
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::myschema TO myappuser;
GO

-- Create a new table
CREATE TABLE myschema.t1 (
    ID INT PRIMARY KEY,
    Name NVARCHAR(50),
    Description NVARCHAR(255)
);
GO