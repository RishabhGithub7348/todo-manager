# Todo App Frontend

This is the frontend for a todo management application built with **Next.js**, **TypeScript**, **React Query**, and **Shadcn/UI**. It allows users to create, update, delete, and manage todos, add notes, filter tasks, and export them as CSV. The app integrates with a backend API to handle data persistence and supports user-specific todo lists.

## Features

- **User Authentication**: Select users to view and manage their todos via a `UserContext`.
- **Todo Management**:
  - Create, edit, delete, and toggle completion of todos.
  - Filter todos by search term, priority, or tags.
  - Sort todos by date or priority.
  - Add notes to individual todos.
- **Export Todos**: Export todos as a CSV file.
- **Responsive UI**: Includes a sidebar, header, and modal dialogs for task creation/editing and notes.
- **Real-time Updates**: Uses React Query for data fetching and automatic refetching after mutations.
- **Error Handling**: Displays user-friendly error messages via toasts.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: React Query (@tanstack/react-query)
- **UI Components**: Shadcn/UI (with Tailwind CSS)
- **HTTP Client**: Axios
- **Context**: React Context API (`UserContext` for user selection)
- **Styling**: Tailwind CSS
- **Type Definitions**: Custom types in `src/types/api.ts`

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Backend API**: A running backend server (e.g., at `http://localhost:3001`) with endpoints for todos, users, and notes.
- **Git**: For cloning the repository

## Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd todo-app-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   - Create a `.env.local` file in the root directory with the following:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:3001/api
     ```
   - Ensure the backend API is running and accessible at the specified URL.

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   - Open `http://localhost:3000` in your browser to view the app.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
src/
├── components/                # Reusable UI components
│   ├── Sidebar.tsx           # Sidebar for navigation and tag filtering
│   ├── TaskList.tsx          # Displays the list of todos
│   ├── tasks/                # Task-related components
│   │   ├── CreateEditTaskModal.tsx  # Modal for creating/editing todos
│   │   ├── TaskNotesModal.tsx      # Modal for adding notes to todos
│   ├── header/               # Header component
│   │   ├── header.tsx        # Header with search and create task button
├── config/                    # Configuration files
│   ├── axios.ts              # Axios instance for API requests
├── context/                   # React Context for state management
│   ├── userContext.tsx       # Context for current user selection
├── hooks/                     # Custom hooks
│   ├── use-toast.tsx         # Toast notification hook (Shadcn/UI)
├── pages/                     # Next.js pages
│   ├── TodosPage.tsx         # Main page for todo management
├── providers/                 # React Query hooks for data fetching
│   ├── todos.ts              # Hooks for todo CRUD operations
│   ├── user.ts               # Hooks for user data
│   ├── notes.ts              # Hooks for note operations
├── types/                     # TypeScript type definitions
│   ├── api.ts                # Interfaces for API data (ITodo, IUser, etc.)
├── utils/                     # Utility functions
│   ├── exportData.ts         # Function to export todos as CSV
└── app/                       # Next.js App Router
    ├── api/                  # API proxy routes
    │   ├── [...path]/route.ts # Proxy to backend API
    ├── layout.tsx            # Root layout
    ├── page.tsx              # Root page (optional)
```

## Key Dependencies

- `@tanstack/react-query`: Data fetching and state synchronization
- `axios`: HTTP requests to the backend API
- `@radix-ui/*`, `shadcn/ui`: UI components and utilities
- `tailwindcss`: Styling
- `typescript`: Type safety
- `next`: Framework for server-side rendering and routing

Install dependencies with:
```bash
npm install @tanstack/react-query axios tailwindcss @radix-ui/react-dialog @radix-ui/react-toast next typescript
```

## Usage

1. **Select a User**:
   - Use the user selector (in `Sidebar` or `Header`) to choose a user. Todos are fetched based on the selected user’s `pid`.

2. **Manage Todos**:
   - **Create**: Click the “Create Task” button in the header to open the `CreateEditTaskModal`.
   - **Edit**: Click a todo in `TaskList` to edit it in the modal.
   - **Delete**: Click the delete button on a todo, confirm the action, and the list updates automatically.
   - **Toggle Completion**: Click a todo’s checkbox to toggle its completion status.
   - **Add Notes**: Click the notes button on a todo to open `TaskNotesModal` and add notes.

3. **Filter and Sort**:
   - Use the search bar in `Header` to filter by title.
   - Filter by priority or tags via `TaskList` or `Sidebar`.
   - Sort todos by date or priority in `TaskList`.

4. **Export Todos**:
   - Click the export button in `Sidebar` to download todos as a CSV file.

## API Integration

The frontend communicates with a backend API via a proxy (`app/api/[...path]/route.ts`) that forwards requests to `NEXT_PUBLIC_API_URL`. Key endpoints:

- `GET /api/todos?userPid=:pid`: Fetch todos for a user.
- `POST /api/todos`: Create a todo.
- `PATCH /api/todos/:pid`: Update a todo.
- `DELETE /api/todos/:pid`: Delete a todo (returns `200` with `{ message: "Successfully deleted" }`).
- `PATCH /api/todos/:pid/toggle`: Toggle todo completion.
- `POST /api/notes`: Create a note for a todo.
- `GET /api/users`: Fetch users for the user selector.

See `src/types/api.ts` for request/response types.

## Development Notes

- **React Query**: Used for data fetching and mutations (`useGetTodos`, `useDeleteTodo`, etc.). Queries are invalidated after mutations to keep the UI in sync.
- **Type Safety**: All API interactions use TypeScript interfaces (`ITodo`, `IUser`, etc.) defined in `src/types/api.ts`.
- **Error Handling**: Errors from API calls are displayed via toasts using `use-toast`.
- **Proxy**: The Next.js API route (`app/api/[...path]/route.ts`) proxies requests to the backend to avoid CORS issues.


## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

MIT License. See `LICENSE` for details.