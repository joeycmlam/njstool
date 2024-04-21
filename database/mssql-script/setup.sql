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
CREATE LOGIN myapplogin WITH PASSWORD = 'MyAppPassword!1234';
GO

-- Create a new user for the login
CREATE USER myappuser FOR LOGIN myapplogin WITH DEFAULT_SCHEMA = myschema;
GO

-- Grant permissions to the user
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::myschema TO myappuser;
GO
