# Coding Standards
## 1. Purpose
This document defines the coding standards for the project.  
Its goal is to keep the codebase consistent, readable, maintainable, and easy to extend by any team member.

These rules apply to all production code, tests, and configuration files unless a strong technical reason justifies an exception.

## 2. General Principles
- Prefer clarity over cleverness.
- Write code that another team member can understand quickly.
- Keep responsibilities separated.
- Avoid duplicated logic.
- Favor small, focused classes and methods.
- Use explicit and descriptive names.
- Follow the same structure across all features.
- If a rule must be broken, document the reason in the code review or commit.

## 3. Language, Framework and Tools
 - Language: Java 21
 - Framework: Spring-Boot
 - Build Tool: Maven
 - Containerization: Docker

## 4. Structure
Expect one package per entity -> include Entity, Repository, Service, Controller, DTOs and Mappers


## 5. Class Naming
Use explicit, predictable names

### 5.1 Entities
They represent the business class directly, do not include 'Entity' in the name. Unless there is a strong reason keep names clean
> [!example]- Examples
> - User
> - Task
> - Project

### 5.2 Controllers
They end with 'Controller'
> [!example]- Examples
> - UserController
> - TaskController

### 5.3 Services
They end with 'Services'
> [!example]- Examples
> - UserService
> - TaskService

### 5.4 Repositories
They end with 'Repository'.
> [!example]- Examples
> - UserRepository
> - TaskRepository

#### 5.4.1 Queries
Use explicit names
> [!example]- Examples
> - findByEmail
> - existsByNameAndOwnerId

> [!failure]- Avoid
> - findData
> - searchStuff

### 5.5 Mappers
They end with 'Mapper'
> [!example]- Examples
> - UserMapper
> - TaskMapper

### 5.6 DTOs
They explicitly include 'Request' or 'Response'
> [!example]- Examples
> - CreateUserRequest
> - UpdateUserRequest
> - UserResponse
> - CreateTaskRequest
> - DeleteTaskRequest
> - TaskResponse

## 6. Package
They MUST be lowercase, singular and represent a feature, subpackages included.
> [!example]- Examples
> - user
> - task
> - user.dto

## 7. Naming Convention

### 7.1 Variables
Use camelCase, be descriptive
> [!example]- Examples
> - userId
> - taskTitle
> - createdAt
> - isCompleted


> [!failure]- Avoid
> - u 
> - x
> - data
> - obj

### 7.2 Constants
Use UPPER_SNAKE_CASE, must be declared static and final
> [!example]- Examples
> - MAX_LOGIN_ATTEMPTS
> - DEFAULT_PAGE_SIZE

### 7.3 Methods
Use camelCase and start with a verb (highly advisable)
> [!example]- Examples
> - createUser
> - findTaskById
> - assignTaskToUser
>  boolean methods
>  - isCompleted
>  - hasOwner
>  - canBeDeleted

> [!failure]- Avoid
> - process
> - handle
> - doX
> - manage

### 7.4 Boolean fields
Names should clearly express state
> [!example]- Examples
> - completed
> - active

> [!failure]- Avoid
> - flag
> - value
> - statusOk

### 7.5 Test Naming
Tests must follow this format
MethodName_ExpectedResult_Condition

> [!example]- Examples
> - createTask_ReturnsTaskResponse_WhenRequestIsValid
> - findUserById_ThrowsException_WhenUserDoesNotExist
> - assignTaskToUser_UpdatesAssignee_WhenUserBelongsToProject

## 8. Project Workflow
The controllers receives the DTO request and calls the corresponding Service / Façade. The Service coordinates the Mappers, do business logic and calls the repository. The repository access the database

### 8.1 Controller
The controller handles the API Requests with the Request DTO, validates data,calls the relevant service and returns the Response DTO.
They do NOT contain business logic or contain repository calls.

### 8.2 Service
The service handles the business logic, coordinates necessary repositories, mappers and domain logic.
They do NOT contain HTTP-specific logic, return RAW data to controllers or become giant classes with huge responsibilities (see Façade for that).

### 8.3 Repositories
Only responsible for data access. They extend from the Spring Data Interface.
They do NOT contain business logic, handle mappers or contain HTTP logic.

### 8.4 DTOs
They are divided in Request DTOs and Response DTOs.
Controller receive Request and return Response.
They do NOT contain logic

### 8.5 Mapper
Mapper convert entities into DTOs. Every feature should have its own mapper.

### 8.6 Façade / Facade
If the Service layer is overwhelmed by responsibilites a Facade layer may appear to relieve it, this Facade will coordinate different services. 

## 9. Logs
Every service should be logged, meaningful events.
Never log passwords, tokens or other sensitive information
Use the AuditAction for the events
> [!example]- What Should Be Logged
> - Business Actions
> - Unexpected Situations
> - Warnings
> - Exceptions

> [!failure]- What Should NOT Be Logged
> - Every Getter/Setter
> - Mapper action
> - Sensitive Information

## 10. Exceptions
Exceptions are globally handled by the GlobalExceptionHandler (GEH)
Business Errors must throw custom exceptions. Use said exceptions to return consistent messages to the API

## 11. Database Migrations
Migrations are handled by flyway, do NOT modify db schema, let flyway handle the changes

## 12. Method Design
Have a single clear responsibility
They should be small and readable
Avoid more than 3 levels of nestings (use switches)
Prefer 0 to 3 parameters, if more are needed consider a DTO or value object

## 13. Class Design
Have a single clear resposibility
Use lombok if possible
Prefer composition over unneccesary inheritance

## 14. Entity Design
Represent persistent domain data
Do NOT use @Data in lombok
Be very careful with the @Equals and @toString

## 15. Validation
Use Bean Validation where appropriate

## 16. Test
Testing is mandatory, each test handles one specific behaviour.
Use H2 and Mockito for testing with data.
Test edge cases. If a function has a something like
if (foo > 5) ...
test for foo < 5, foo = 5 and foo > 5

## 17. Comments
Should not be necessary to explain methods, if necessary rethink the method logic.
Explain WHY not WHAT

## 18. Misc
If a value is repeated several times, consider it a CONSTANT.

## 19. GitHub and Collaborations
To add a feature or fix code first create an Issue and handle it to yourself, create the branch FROM the issue then open a Pull Request and wait for it to be reviewed by at least two members. If successful, delete the branch and the issue(if still open).

## 20. Docs
Document everything, the what, when, where, who and why. Each change must have a reason. Any challenges might also be documented

# Changelog
1.0 - Release
1.1 - Fixed Typos
