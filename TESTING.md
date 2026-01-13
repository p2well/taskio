# Testing Guide

This document provides information about running tests for both the frontend (Next.js) and backend (Spring Boot) components of the Taskio application.

## Frontend Tests

### Technology Stack
- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/user-event**: For simulating user interactions

### Test Structure
```
taskio/
├── components/__tests__/
│   ├── TaskList.test.tsx      # TaskList component tests
│   └── TaskItem.test.tsx      # TaskItem component tests
└── lib/__tests__/
    └── api-client.test.ts     # API client tests
```

### Running Frontend Tests

First, install the testing dependencies:
```bash
cd taskio
npm install
```

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage report:
```bash
npm run test:coverage
```

### Frontend Test Coverage

#### TaskList Component Tests
- ✅ Renders empty state when no tasks exist
- ✅ Renders task items when tasks are provided
- ✅ Properly passes props to child components

#### TaskItem Component Tests
- ✅ Renders task information correctly
- ✅ Displays correct status badges (TODO, IN_PROGRESS, DONE)
- ✅ Handles optional fields (description, category)
- ✅ Triggers edit callback when edit button is clicked

#### API Client Tests
- ✅ getAllTasks: Fetches all tasks successfully
- ✅ searchAndFilterTasks: Searches with query, filters by status, date range, and category
- ✅ createTask: Creates new tasks and handles validation errors
- ✅ updateTask: Updates existing tasks and handles not found errors
- ✅ deleteTask: Deletes tasks and handles not found errors
- ✅ getAllCategories: Fetches all unique categories
- ✅ Error handling: Properly throws errors on API failures

## Backend Tests

### Technology Stack
- **JUnit 5**: Testing framework for Java
- **Mockito**: Mocking framework
- **Spring Boot Test**: Testing support for Spring Boot applications
- **MockMvc**: For testing REST controllers
- **AssertJ**: Fluent assertion library

### Test Structure
```
taskio-backend/
└── src/test/java/com/taskio/
    ├── service/
    │   └── TaskServiceTest.java        # Unit tests for TaskService
    └── controller/
        └── TaskControllerTest.java     # Integration tests for TaskController
```

### Running Backend Tests

Navigate to the backend directory:
```bash
cd taskio-backend
```

Run all tests using Maven:
```bash
mvn test
```

Run tests with coverage report:
```bash
mvn test jacoco:report
```

Run a specific test class:
```bash
mvn test -Dtest=TaskServiceTest
```

Run tests and skip compilation:
```bash
mvn surefire:test
```

### Backend Test Coverage

#### TaskService Unit Tests
- ✅ getAllTasks: Returns all tasks from repository
- ✅ getTaskById: Returns task when exists, empty when not found
- ✅ createTask: Saves and returns new task
- ✅ updateTask: Updates existing task with new details
- ✅ updateTask: Throws exception when task not found
- ✅ deleteTask: Deletes existing task
- ✅ deleteTask: Throws exception when task not found
- ✅ searchTasks: Searches by term, returns all when term is empty
- ✅ filterByStatus: Filters tasks by status
- ✅ filterByDateRange: Filters tasks by due date range
- ✅ searchAndFilter: Combines all filters, returns all when no filters
- ✅ getAllCategories: Returns distinct categories

#### TaskController Integration Tests
- ✅ getAllTasks: Returns HTTP 200 with list of tasks
- ✅ searchAndFilterTasks: Filters by query, status, date range, and category
- ✅ getAllCategories: Returns HTTP 200 with list of categories
- ✅ getTaskById: Returns HTTP 200 when found, HTTP 404 when not found
- ✅ createTask: Returns HTTP 201 with created task
- ✅ createTask: Returns HTTP 400 for invalid data (validation)
- ✅ updateTask: Returns HTTP 200 with updated task
- ✅ updateTask: Returns HTTP 404 when task not found
- ✅ deleteTask: Returns HTTP 204 when successful
- ✅ deleteTask: Returns HTTP 404 when task not found

## Test Conventions

### Frontend
- Test files are located alongside the source files in `__tests__` directories
- Test files use the `.test.tsx` or `.test.ts` extension
- Mock external dependencies using Jest mocks
- Use descriptive test names following the pattern: `method_condition_expectedResult`

### Backend
- Test files mirror the structure of source files under `src/test/java`
- Test files end with `Test.java` (e.g., `TaskServiceTest.java`)
- Use `@ExtendWith(MockitoExtension.class)` for unit tests
- Use `@WebMvcTest` for controller integration tests
- Follow AAA pattern: Arrange, Act, Assert
- Use descriptive test names with underscores: `methodName_condition_expectedResult`

## Continuous Integration

Both test suites can be integrated into CI/CD pipelines:

### Frontend CI Example
```yaml
- name: Run Frontend Tests
  run: |
    cd taskio
    npm install
    npm test -- --coverage
```

### Backend CI Example
```yaml
- name: Run Backend Tests
  run: |
    cd taskio-backend
    mvn clean test
```

## Troubleshooting

### Frontend Issues

**Issue**: Tests fail with "Cannot find module"
- **Solution**: Run `npm install` to ensure all dependencies are installed

**Issue**: Jest configuration errors
- **Solution**: Ensure `jest.config.js` and `jest.setup.js` are present in the project root

### Backend Issues

**Issue**: Tests fail with compilation errors
- **Solution**: Run `mvn clean compile` before running tests

**Issue**: Mock dependencies not working
- **Solution**: Ensure `@MockBean` is used for Spring beans in controller tests

## Adding New Tests

### Frontend
1. Create a new test file in the appropriate `__tests__` directory
2. Import the component or module to test
3. Write test cases using `describe` and `it` blocks
4. Use `render` from `@testing-library/react` for components
5. Use `screen` queries to find elements
6. Use `expect` for assertions

### Backend
1. Create a new test class in the corresponding test package
2. Add appropriate test annotations (`@ExtendWith`, `@WebMvcTest`, etc.)
3. Mock dependencies using `@Mock` or `@MockBean`
4. Write test methods annotated with `@Test`
5. Use AssertJ's `assertThat` for fluent assertions
6. Use Mockito's `when`, `verify` for mocking behavior

## Test Metrics

### Current Coverage Goals
- **Frontend**: Aim for >80% code coverage
- **Backend**: Aim for >85% code coverage

To view detailed coverage reports:
- **Frontend**: Open `taskio/coverage/lcov-report/index.html` after running `npm run test:coverage`
- **Backend**: Open `taskio-backend/target/site/jacoco/index.html` after running `mvn test jacoco:report`
