export type User = {
  pid: string;
  username: string;
  displayName: string;
}

export type Todo = {
  pid: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  userPid: string;
  completed: boolean;
  tags?: string[];
  mentions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type Note = {
  pid: string;
  content: string;
  todoPid: string;
  userPid: string;
  createdAt: string;
}

export type CreateTodoRequest = {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  userPid: string;
  tags?: string[];
  mentions?: string[];
}

export type UpdateTodoRequest = {
  title?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  completed?: boolean;
  tags?: string[];
  mentions?: string[];
}

export type CreateNoteRequest = {
  content: string;
  todoPid: string;
  userPid: string;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  errors?: string[];
}

export const Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type PriorityType = typeof Priority[keyof typeof Priority];

export type UserExportResponse = {
  user: User;
  todos: Array<Todo & { notes: Note[] }>;
  exportDate: string;
}


export interface TodoWithNotes extends Todo{
  notes?: Note[];
}

export type SortOption = 'date-asc' | 'date-desc' | 'priority-asc' | 'priority-desc';

export type TodoFilters = {
  priority?: "high" | "medium" | "low";
  tag?: string;
  user?: string;
  search?: string;
}

export type Tag = {
  name: string;
  count: number;
}

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export type MentionedUser = {
  username: string;
  displayName: string;
}
