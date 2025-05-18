# Todo App - Backend

A RESTful API for managing todos and notes, built with TypeScript, Express, Mongoose, and MongoDB. Users can create, update, delete, and toggle todos, add notes to todos, and export their data. The application supports user mentions and tags for collaboration.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Seeding the Database](#seeding-the-database)
- [API Endpoints](#api-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Todo Endpoints](#todo-endpoints)
  - [Note Endpoints](#note-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Management**: Retrieve user details and export todos/notes as JSON.
- **Todo Management**: Create, read, update, delete, and toggle completion of todos.
- **Note Management**: Add and retrieve notes associated with todos.
- **Collaboration**: Support for user mentions (e.g., `@username`) in todos.
- **Tagging**: Add tags to todos for categorization.
- **Error Handling**: Robust validation and error responses using Joi.
- **Data Export**: Export user todos and notes in JSON format.
- **Type Safety**: Built with TypeScript for type-safe code.
- **MongoDB Integration**: Persistent storage with Mongoose ORM.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Joi for request validation
- **Logging**: Custom `oplog` utility for error logging
- **Testing**: Postman for API testing
- **Dependencies**:
  - `express`, `mongoose`, `joi`, `dotenv`
  - Dev: `typescript`, `ts-node`, `nodemon`, `@types/*`

## Prerequisites
- **Node.js**: v16 or higher
- **MongoDB**: Local instance (e.g., `mongodb://localhost:27017`) or MongoDB Atlas
- **Postman**: For API testing
- **Git**: For cloning the repository
- **NPM**: For package management

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/todo-app.git
   cd todo-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` File**:
   - In the `backend/` directory, create a `.env` file:
     ```env
     MONGODB_URI=mongodb://localhost:27017/todo-app
     PORT=3001
     ```

## Configuration
- **MongoDB**:
  - Ensure MongoDB is running locally (`mongod`) or use a MongoDB Atlas URI.
  - Update `MONGODB_URI` in `.env` if using a different database name or cloud service.
- **Port**:
  - Default port is `3001`. Change `PORT` in `.env` if needed.
- **Logging**:
  - Errors are logged using the `oplog` utility (`backend/utils/oplog.ts`).
  - Debug logs can be enabled by adding `mongoose.set('debug', true)` in `server.ts`.

## Running the Application
1. **Development Mode**:
   - Uses `nodemon` and `ts-node` for hot reloading:
     ```bash
     npm run dev
     ```
   - Server runs on `http://localhost:3001`.

2. **Production Mode**:
   - Build TypeScript to JavaScript and start:
     ```bash
     npm run build
     npm start
     ```

3. **Verify**:
   - Open `http://localhost:3001/api/v1/users` in a browser or Postman to confirm the server is running.

## Seeding the Database
The seed script populates the `users` collection with test data.

1. **Run Seed Script**:
   ```bash
   npm run seed
   ```
   - Drops the `users` collection and inserts 5 users:
     - `alex` (Alex Johnson)
     - `maria` (Maria Garcia)
     - `james` (James Wilson)
     - `sarah` (Sarah Chen)
     - `jamal` (Jamal Ahmed)

2. **Verify Seeded Data**:
   - Connect to MongoDB using `mongosh`:
     ```javascript
     use todo-app;
     db.users.find();
     ```
   - Ensure all users have unique `pid` values (e.g., `usr_xxx`).

3. **Notes**:
   - The seed script (`backend/scripts/seed.ts`) ensures no duplicate `pid` values by explicitly generating them using `generatePublicID`.
   - If errors like `MongoBulkWriteError: E11000 duplicate key` occur, drop the collection:
     ```javascript
     db.users.drop();
     ```

## API Endpoints
Base URL: `http://localhost:3001/api/v1`

### User Endpoints
| Method | Endpoint                  | Description                          | Request Body/Params                     | Response                          |
|--------|---------------------------|--------------------------------------|-----------------------------------------|-----------------------------------|
| GET    | `/users`                  | Get all users                        | None                                    | `200`: Array of users            |
| GET    | `/users/:pid`             | Get user by `pid`                    | `pid` (path)                            | `200`: User object, `404`: Error |
| GET    | `/users/:pid/export`      | Export user’s todos/notes as JSON    | `pid` (path)                            | `200`: JSON export               |

### Todo Endpoints
| Method | Endpoint                  | Description                          | Request Body/Params                     | Response                          |
|--------|---------------------------|--------------------------------------|-----------------------------------------|-----------------------------------|
| POST   | `/todos`                  | Create a todo                        | `{ title, userPid, description?, priority?, tags?, mentions? }` | `200`: Todo object, `400`: Error |
| GET    | `/todos`                  | Get all todos or by `userPid`        | `userPid?` (query)                      | `200`: Array of todos            |
| GET    | `/todos/:pid`             | Get todo by `pid` with notes         | `pid` (path)                            | `200`: Todo with notes, `404`: Error |
| PATCH  | `/todos/:pid`             | Update a todo                        | `pid` (path), `{ title?, description?, priority?, tags?, mentions? }` | `200`: Updated todo, `400`: Error |
| DELETE | `/todos/:pid`             | Delete a todo and its notes          | `pid` (path)                            | `204`: No content, `404`: Error  |
| PATCH  | `/todos/:pid/toggle`      | Toggle todo completion               | `pid` (path)                            | `200`: Updated todo, `404`: Error |

### Note Endpoints
| Method | Endpoint                  | Description                          | Request Body/Params                     | Response                          |
|--------|---------------------------|--------------------------------------|-----------------------------------------|-----------------------------------|
| POST   | `/notes`                  | Create a note for a todo             | `{ content, todoPid, userPid }`         | `200`: Note object, `400`: Error |
| GET    | `/todos/:pid/notes`       | Get all notes for a todo             | `pid` (path)                            | `200`: Array of notes, `404`: Error |

#### Example Request: Create Todo
```http
POST http://localhost:3001/api/v1/todos
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "medium",
  "userPid": "usr_01jvfs9gfd7qd7gk9b8ma9wcma",
  "tags": ["shopping", "urgent"],
  "mentions": ["@maria", "@jamal"]
}
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "pid": "tdo_xxx",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "medium",
    "userPid": "usr_01jvfs9gfd7qd7gk9b8ma9wcma",
    "completed": false,
    "tags": ["shopping", "urgent"],
    "mentions": ["@maria", "@jamal"],
    "createdAt": "2025-05-18T01:22:00.000Z",
    "updatedAt": "2025-05-18T01:22:00.000Z"
  }
}
```

## Testing with Postman
1. **Setup Postman**:
   - Download Postman from [postman.com](https://www.postman.com/downloads/).
   - Create a new collection named `Todo App API`.

2. **Collection Variables**:
   - Set `baseUrl`: `http://localhost:3001/api/v1`.
   - Add variables: `alexPid`, `todoPid`, `notePid` (populated during tests).

3. **Test Workflow**:
   - **GET /users**: Retrieve all users and save `alexPid`.
     ```javascript
     const response = pm.response.json();
     const alexPid = response.data.find(user => user.username === 'alex').pid;
     pm.collectionVariables.set('alexPid', alexPid);
     ```
   - **POST /todos**: Create a todo with `userPid: {{alexPid}}` and save `todoPid`.
     ```javascript
     const response = pm.response.json();
     pm.collectionVariables.set('todoPid', response.data.pid);
     ```
   - **POST /notes**: Create a note for `todoPid` and save `notePid`.
   - **GET /todos/:pid**: Verify todo and notes.
   - **PATCH /todos/:pid/toggle**: Toggle completion.
   - **DELETE /todos/:pid**: Delete todo and confirm notes are removed.

4. **Sample Request**:
   - Method: `POST`
   - URL: `{{baseUrl}}/todos`
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "title": "Buy groceries",
       "description": "Milk, eggs, bread",
       "priority": "medium",
       "userPid": "{{alexPid}}",
       "tags": ["shopping", "urgent"],
       "mentions": ["@maria", "@jamal"]
     }
     ```
   - Tests:
     ```javascript
     pm.test("Status code is 200", () => {
       pm.response.to.have.status(200);
     });
     pm.test("Todo created", () => {
       const response = pm.response.json();
       pm.expect(response.success).to.be.true;
       pm.expect(response.data.title).to.equal('Buy groceries');
     });
     ```

5. **Run Collection**:
   - Use Postman’s Collection Runner to execute all requests and verify tests pass.

## Troubleshooting
- **MongoBulkWriteError: E11000 duplicate key**:
  - Caused by duplicate `pid` values in the `users` collection.
  - Fix: Drop the collection and re-run the seed script:
    ```javascript
    db.users.drop();
    npm run seed
    ```
- **Cannot read properties of undefined (reading 'userPid')**:
  - Occurs if `req.body` is undefined in `POST /todos`.
  - Fix: Ensure `express.json()` is in `server.ts` and log `req.body` in `todos_controller.ts`.
- **MongoDB Connection Error**:
  - Ensure `MONGO_URI` is correct in `.env` and MongoDB is running.
  - Test connection:
    ```javascript
    mongosh mongodb://localhost:27017/todo-app
    ```
- **404 Errors**:
  - Verify `pid` exists in the database:
    ```javascript
    db.users.find({ pid: "usr_xxx" });
    db.todos.find({ pid: "tdo_xxx" });
    ```
- **Postman Issues**:
  - Ensure `Content-Type: application/json` for POST/PATCH requests.
  - Check collection variables are set correctly.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License
MIT License. See [LICENSE](LICENSE) for details.
