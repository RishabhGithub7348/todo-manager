import { frontendAxios } from "@/config/axios";
import { Todo, CreateTodoRequest, UpdateTodoRequest, ApiResponse, Note } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";

/**
 * Creates a new todo.
 * @param data The todo creation data.
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving to the created todo.
 * @throws Error if the request fails.
 */
export const createTodo = async (
  data: CreateTodoRequest,
  axiosInstance: AxiosInstance = frontendAxios
): Promise<Todo> => {
  try {
    const response = await axiosInstance.post<
      CreateTodoRequest,
      AxiosResponse<ApiResponse<Todo>>
    >("/todos", data);
    if (!response.data.success) {
      throw new Error(response.data.errors?.join(", ") || "Failed to create todo");
    }
    return response.data.data;
  } catch (err) {
    throw new Error(
      `Error creating todo: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Fetches todos, optionally filtered by user PID.
 * @param userPid The user’s PID (optional).
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving to an array of todos with notes.
 * @throws Error if the request fails.
 */
export const fetchTodos = async (
  userPid?: string,
  axiosInstance: AxiosInstance = frontendAxios
): Promise<Array<Todo & { notes: Note[] }>> => {
  try {
    const url = userPid ? `/todos?userPid=${userPid}` : "/todos";
    const response = await axiosInstance.get<
      null,
      AxiosResponse<ApiResponse<Array<Todo & { notes: Note[] }>>>
    >(url);
    if (!response.data.success) {
      throw new Error(response.data.errors?.join(", ") || "Failed to fetch todos");
    }
    return response.data.data;
  } catch (err) {
    throw new Error(
      `Error fetching todos: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Fetches a todo by PID.
 * @param pid The todo’s PID.
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving to the todo with notes.
 * @throws Error if the request fails.
 */
export const fetchTodoByPid = async (
  pid: string,
  axiosInstance: AxiosInstance = frontendAxios
): Promise<Todo & { notes: Note[] }> => {
  try {
    const response = await axiosInstance.get<
      null,
      AxiosResponse<ApiResponse<Todo & { notes: Note[] }>>
    >(`/todos/${pid}`);
    if (!response.data.success) {
      throw new Error(response.data.errors?.join(", ") || "Failed to fetch todo");
    }
    return response.data.data;
  } catch (err) {
    throw new Error(
      `Error fetching todo: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Updates a todo.
 * @param pid The todo’s PID.
 * @param data The update data.
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving to the updated todo with notes.
 * @throws Error if the request fails.
 */
export const updateTodo = async (
  pid: string,
  data: UpdateTodoRequest,
  axiosInstance: AxiosInstance = frontendAxios
): Promise<Todo & { notes: Note[] }> => {
  try {
    const response = await axiosInstance.patch<
      UpdateTodoRequest,
      AxiosResponse<ApiResponse<Todo & { notes: Note[] }>>
    >(`/todos/${pid}`, data);
    if (!response.data.success) {
      throw new Error(response.data.errors?.join(", ") || "Failed to update todo");
    }
    return response.data.data;
  } catch (err) {
    throw new Error(
      `Error updating todo: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Deletes a todo.
 * @param pid The todo’s PID.
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving when the todo is deleted.
 * @throws Error if the request fails.
 */

export const deleteTodo = async (
  pid: string,
  axiosInstance: AxiosInstance = frontendAxios
): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/todos/${pid}`);
    // Treat 200 and 204 as success
    if (response.status === 200 || response.status === 204) {
      return;
    }
    // Handle unexpected success status with body
    if (response.data && !response.data.success) {
      throw new Error(response.data.errors?.join(", ") || response.data.message || "Failed to delete todo");
    }
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (err) {
     throw new Error(
      `Error deleting todo: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Toggles a todo’s completion status.
 * @param pid The todo’s PID.
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving to the updated todo with notes.
 * @throws Error if the request fails.
 */
export const toggleTodoCompletion = async (
  pid: string,
  axiosInstance: AxiosInstance = frontendAxios
): Promise<Todo & { notes: Note[] }> => {
  try {
    const response = await axiosInstance.patch<
      null,
      AxiosResponse<ApiResponse<Todo & { notes: Note[] }>>
    >(`/todos/${pid}/toggle`);
    if (!response.data.success) {
      throw new Error(
        response.data.errors?.join(", ") || "Failed to toggle todo completion"
      );
    }
    return response.data.data;
  } catch (err) {
    throw new Error(
      `Error toggling todo completion: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Hook to fetch todos.
 * @param userPid The user’s PID (optional).
 * @returns A React Query instance for the todos.
 */
export const useGetTodos = (userPid?: string) => {
  return useQuery<Array<Todo & { notes: Note[] }>, Error>({
    queryKey: ["todos", userPid],
    queryFn: () => fetchTodos(userPid, frontendAxios),
  });
};

/**
 * Hook to fetch a todo by PID.
 * @param pid The todo’s PID.
 * @returns A React Query instance for the todo.
 */
export const useGetTodoByPid = (pid: string | null) => {
  return useQuery<Todo & { notes: Note[] }, Error>({
    queryKey: ["todo", pid],
    queryFn: () => {
      if (!pid) {
        throw new Error("Todo PID is required");
      }
      return fetchTodoByPid(pid, frontendAxios);
    },
    enabled: !!pid,
  });
};

/**
 * Hook to create a todo.
 * @returns A React Query mutation instance to create a todo.
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoRequest) => createTodo(data, frontendAxios),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

/**
 * Hook to update a todo.
 * @returns A React Query mutation instance to update a todo.
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pid, data }: { pid: string; data: UpdateTodoRequest }) =>
      updateTodo(pid, data, frontendAxios),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", data.pid] });
    },
  });
};

/**
 * Hook to delete a todo.
 * @returns A React Query mutation instance to delete a todo.
 */
export const useDeleteTodo = (userPid?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pid: string) => deleteTodo(pid, frontendAxios),
    onSuccess: () => {
      // Invalidate todos for the specific user
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      console.error("Delete todo error:", error);
    },
  });
};

/**
 * Hook to toggle a todo’s completion status.
 * @returns A React Query mutation instance to toggle a todo.
 */
export const useToggleTodoCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pid: string) => toggleTodoCompletion(pid, frontendAxios),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", data.pid] });
    },
  });
};
