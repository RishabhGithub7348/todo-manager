# Todo App

This is a full-stack todo management application with a **Next.js** frontend (`client`) and an **Express** backend (`server`). Users can create, update, delete, and manage todos, add notes, filter tasks, sort them, and export them as CSV. The app supports user-specific todo lists and provides real-time updates using React Query.

## Features

- **User Management**: Select users to manage their todos.
- **Todo Management**:
  - Create, edit, delete, and toggle completion of todos.
  - Filter by search term, priority, or tags.
  - Sort by date or priority.
  - Add notes to todos.
- **Export Todos**: Download todos as a CSV file.
- **Responsive UI**: Includes a sidebar, header, and modals for task creation/editing and notes.
- **Real-time Updates**: React Query handles data fetching and refetching after mutations.
- **Error Handling**: User-friendly error messages via toasts.
- **Backend API**: RESTful API with endpoints for todos, users, and notes, returning success messages (e.g., `{ message: "Successfully deleted" }` for deletions).

## Tech Stack

### Client (Frontend)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: React Query (@tanstack/react-query)
- **UI Components**: Shadcn/UI (with Tailwind CSS)
- **HTTP Client**: Axios
- **Context**: React Context API (`UserContext`)
- **Styling**: Tailwind CSS

### Server (Backend)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (assumed, customizable)
- **ORM/ODM**: Mongoose (assumed)
- **HTTP Server**: Node.js

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **MongoDB**: A running MongoDB instance (local or cloud, e.g., MongoDB Atlas)
- **Git**: For cloning the repository

## Project Structure

```
todo-app/
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── components/        # UI components (Sidebar, TaskList, etc.)
│   │   ├── config/            # Axios setup
│   │   ├── context/           # UserContext
│   │   ├── hooks/             # Custom hooks (use-toast)
│   │   ├── pages/             # Pages (TodosPage)
│   │   ├── providers/         # React Query hooks (todos, users, notes)
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Utilities (exportData)
│   │   ├── app/               # App Router (API proxy, layout)
│   ├── public/                # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── .env.local
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/            # API routes (todos, users, notes)
│   │   ├── services/          # Business logic (TodoService, etc.)
│   │   ├── models/            # Database models (Todo, User, Note)
│   │   ├── utils/             # Utilities (error handling)
│   │   ├── config/            # Database setup
│   │   ├── app.ts             # Express app
│   │   ├── server.ts          # Server entry
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
├── README.md                  # This file
```

## Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Set Up the Server (Backend)**:
   - Navigate to the `server` folder:
     ```bash
     cd server
     npm install
     ```
   - Create a `.env` file in `server/`:
     ```env
     PORT=3001
     MONGODB_URI=mongodb://localhost:27017/todo-app
     ```
   - Start the backend:
     ```bash
     npm run dev
     ```
   - The server runs at `http://localhost:3001`.

3. **Set Up the Client (Frontend)**:
   - Navigate to the `client` folder:
     ```bash
     cd ../client
     npm install
     ```
   - Create a `.env.local` file in `client/`:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:3001/api
     ```
   - Start the frontend:
     ```bash
     npm run dev
     ```
   - The app runs at `http://localhost:3000`.

4. **Run Both Simultaneously**:
   - Use separate terminals for `client` and `server`, or use a tool like `concurrently`:
     - Add to `package.json` in the root:
       ```json
       "scripts": {
         "start:client": "cd client && npm run dev",
         "start:server": "cd server && npm run dev",
         "start": "concurrently \"npm run start:server\" \"npm run start:client\""
       }
       ```
     - Install `concurrently`:
       ```bash
       npm install concurrently --save-dev
       ```
     - Run:
       ```bash
       npm start
       ```

5. **Build for Production**:
   - Client:
     ```bash
     cd client
     npm run build
     npm start
     ```
   - Server:
     ```bash
     cd server
     npm run build
     npm start
     ```

## Usage

1. **Access the App**:
   - Open `http://localhost:3000` in your browser.

2. **Select a User**:
   - Use the user selector in the sidebar or header to choose a user (e.g., “JohnDoe”).
   - Todos load for the selected user.

3. **Manage Todos**:
   - **Create**: Click “Create Task” in the header to open a modal. Enter details (e.g., title: “Prepare Video Demo”, priority: High, tags: ["demo"]).
   - **Edit**: Click a todo in the list to edit its details.
   - **Delete**: Click the delete button, confirm, and see the list update automatically (with a “Task deleted” toast).
   - **Toggle Completion**: Check/uncheck a todo’s checkbox.
   - **Add Notes**: Click the notes button to add notes to a todo.

4. **Filter and Sort**:
   - Search todos via the header’s search bar.
   - Filter by priority or tags in the sidebar or task list.
   - Sort by date or priority.

5. **Export Todos**:
   - Click the export button in the sidebar to download a CSV file.

## API Endpoints

The backend (`server`) provides the following RESTful endpoints, proxied through `client/app/api/[...path]/route.ts`:

- **Todos**:
  - `GET /api/todos?userPid=:pid`: Fetch todos for a user.
  - `POST /api/todos`: Create a todo.
  - `PATCH /api/todos/:pid`: Update a todo.
  - `DELETE /api/todos/:pid`: Delete a todo (returns `200`, `{ message: "Successfully deleted" }`).
  - `PATCH /api/todos/:pid/toggle`: Toggle completion.
- **Notes**:
  - `POST /api/notes`: Create a note for a todo.
- **Users**:
  - `GET /api/users`: Fetch all users.

See `client/src/types/api.ts` for request/response types.

## Key Dependencies

### Client
- `@tanstack/react-query`: Data fetching and mutations
- `axios`: HTTP requests
- `next`: Framework
- `tailwindcss`: Styling
- `@radix-ui/*`, `shadcn/ui`: UI components
- `typescript`: Type safety

### Server
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `typescript`: Type safety
- `dotenv`: Environment variables

Install dependencies:
```bash
cd client && npm install
cd ../server && npm install
```

## Development Notes

- **Client**:
  - Uses React Query for data fetching (`useGetTodos`, `useDeleteTodo`, etc.).
  - Invalidates queries after mutations to sync UI (e.g., refetch todos after deletion).
  - Proxies API requests to `NEXT_PUBLIC_API_URL` to avoid CORS.
- **Server**:
  - Uses TypeScript for type-safe routes and services.
  - Returns `200` with `{ message: "Successfully deleted" }` for `DELETE /api/todos/:pid`.
- **Error Handling**:
  - Client: Toasts for API errors (e.g., “Todo not found” for `404`).
  - Server: `ReturnError` utility for consistent error responses.

## Troubleshooting

- **Todos Not Updating**:
  - Check `useDeleteTodo` in `client/src/providers/todos.ts` for `invalidateQueries(['todos', userPid])`.
  - Verify `currentUser?.pid` in `client/src/context/userContext.tsx`.
  - Console log: `Invalidating todos for userPid: <pid>`.

- **API Errors**:
  - Test endpoints:
    ```bash
    curl -X DELETE http://localhost:3001/api/todos/valid-pid
    ```
  - Check `client/src/providers/todos.ts` logs:
    ```typescript
    console.log("Delete Response:", response.status, response.data);
    ```

- **Database Issues**:
  - Ensure MongoDB is running and `MONGODB_URI` is correct in `server/.env`.
  - Check `server/src/config/database.ts`.

- **Build Issues**:
  - Run `npm run build` in `client` and `server` to catch TypeScript errors.
  - Verify dependency versions in `package.json`.

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add feature"`.
4. Push: `git push origin feature-name`.
5. Open a pull request.

## License

MIT License. See `LICENSE` for details.