import { frontendAxios } from "@/config/axios";
import { Note, CreateNoteRequest, ApiResponse } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";


/**
 * Creates a new note.
 * @param data The note creation data.
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving to the created note.
 * @throws Error if the request fails.
 */
export const createNote = async (
  data: CreateNoteRequest,
  axiosInstance: AxiosInstance = frontendAxios
): Promise<Note> => {
  try {
    const response = await axiosInstance.post<
      CreateNoteRequest,
      AxiosResponse<ApiResponse<Note>>
    >("/notes", data);
    if (!response.data.success) {
      throw new Error(response.data.errors?.join(", ") || "Failed to create note");
    }
    return response.data.data;
  } catch (err) {
    throw new Error(
      `Error creating note: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Fetches notes for a todo.
 * @param todoPid The todo’s PID.
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving to an array of notes.
 * @throws Error if the request fails.
 */
export const fetchNotesByTodoPid = async (
  todoPid: string,
  axiosInstance: AxiosInstance = frontendAxios
): Promise<Note[]> => {
  try {
    const response = await axiosInstance.get<
      null,
      AxiosResponse<ApiResponse<Note[]>>
    >(`/todos/${todoPid}/notes`);
    if (!response.data.success) {
      throw new Error(response.data.errors?.join(", ") || "Failed to fetch notes");
    }
    return response.data.data;
  } catch (err) {
    throw new Error(
      `Error fetching notes: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Hook to fetch notes by todo PID.
 * @param todoPid The todo’s PID.
 * @returns A React Query instance for the notes.
 */
export const useGetNotesByTodoPid = (todoPid: string | null) => {
  return useQuery<Note[], Error>({
    queryKey: ["notes", todoPid],
    queryFn: () => {
      if (!todoPid) {
        throw new Error("Todo PID is required");
      }
      return fetchNotesByTodoPid(todoPid, frontendAxios);
    },
    enabled: !!todoPid,
  });
};

/**
 * Hook to create a note.
 * @returns A React Query mutation instance to create a note.
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteRequest) => createNote(data, frontendAxios),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes", data.todoPid] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};