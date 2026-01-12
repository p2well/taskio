# Taskio

A professional, full-stack task management application built with Next.js and Spring Boot.

## Features

### Frontend
- ✅ List all tasks with real-time updates
- ✅ Create new tasks with a user-friendly form
- ✅ Edit and delete existing tasks
- ✅ Change task status via dropdown
- ✅ Sort tasks by status or due date
- ✅ Form validation with character limits
- ✅ Error handling for API failures
- ✅ Responsive design with Tailwind CSS

### Backend
- ✅ RESTful API with full CRUD operations
- ✅ Bean Validation for input validation
- ✅ H2 in-memory database
- ✅ CORS enabled for frontend communication
- ✅ Global exception handling

## Tech Stack

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

**Backend:**
- Java 17
- Spring Boot 3.2.1
- Spring Data JPA
- H2 Database
- Maven

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Java 17+
- Maven 3.6+

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd taskio-backend
   ```

2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

3. The API will be available at `http://localhost:8080`

4. (Optional) Access H2 Console at `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:taskiodb`
   - Username: `sa`
   - Password: (leave blank)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd taskio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file (already created):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

### Frontend (taskio/)
```
taskio/
├── app/
│   ├── page.tsx           # Main page with task management
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── TaskForm.tsx       # Task creation/editing form
│   ├── TaskItem.tsx       # Individual task component
│   └── TaskList.tsx       # Task list component
├── lib/
│   └── api-client.ts      # API client for backend communication
└── types/
    └── task.ts            # TypeScript types and interfaces
```

### Backend (taskio-backend/)
```
taskio-backend/
├── src/main/java/com/taskio/
│   ├── TaskioApplication.java      # Main application class
│   ├── model/
│   │   ├── Task.java               # Task entity
│   │   └── TaskStatus.java         # Status enum
│   ├── repository/
│   │   └── TaskRepository.java     # JPA repository
│   ├── service/
│   │   └── TaskService.java        # Business logic
│   ├── controller/
│   │   └── TaskController.java     # REST endpoints
│   ├── config/
│   │   └── WebConfig.java          # CORS configuration
│   └── exception/
│       └── GlobalExceptionHandler.java  # Exception handling
└── src/main/resources/
    └── application.properties      # Application configuration
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## Task Model

```typescript
{
  id: number;              // Auto-generated
  title: string;           // Required, max 100 chars
  description?: string;    // Optional, max 500 chars
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: string;        // Optional, ISO date format
}
```

## Usage

1. **Create a Task**: Click the "New Task" button and fill in the form
2. **Edit a Task**: Click the edit icon on any task card
3. **Delete a Task**: Click the delete icon (with confirmation)
4. **Change Status**: Use the status dropdown on each task
5. **Sort Tasks**: Use the sort dropdown to organize by status or due date

## Development

### Run Frontend Dev Server
```bash
cd taskio
npm run dev
```

### Run Backend
```bash
cd taskio-backend
mvn spring-boot:run
```

### Build for Production

**Frontend:**
```bash
npm run build
npm start
```

**Backend:**
```bash
mvn clean package
java -jar target/taskio-backend-1.0.0.jar
```

## License

This project is open source and available under the MIT License.