import { frontendAxios } from "@/config/axios";
import { ApiResponse, User, UserExportResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";


/**
 * Fetches all users.
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving to an array of users.
 * @throws Error if the request fails.
 */
export const fetchUsers = async (
  axiosInstance: AxiosInstance = frontendAxios
): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<
      null,
      AxiosResponse<ApiResponse<User[]>>
    >("/users");
    if (!response.data.success) {
      throw new Error(response.data.errors?.join(", ") || "Failed to fetch users");
    }
    return response.data.data;
  } catch (err) {
    throw new Error(
      `Error fetching users: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Fetches a user by PID.
 * @param pid The user’s PID.
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving to the user.
 * @throws Error if the request fails.
 */
export const fetchUserByPid = async (
  pid: string,
  axiosInstance: AxiosInstance = frontendAxios
): Promise<User> => {
  try {
    const response = await axiosInstance.get<
      null,
      AxiosResponse<ApiResponse<User>>
    >(`/users/${pid}`);
    if (!response.data.success) {
      throw new Error(response.data.errors?.join(", ") || "Failed to fetch user");
    }
    return response.data.data;
  } catch (err) {
    throw new Error(
      `Error fetching user: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Exports a user’s todos and notes as JSON.
 * @param pid The user’s PID.
 * @param axiosInstance The Axios instance to use.
 * @returns A promise resolving to the export data.
 * @throws Error if the request fails.
 */
export const exportUserData = async (
  pid: string,
  axiosInstance: AxiosInstance = frontendAxios
): Promise<UserExportResponse> => {
  try {
    const response = await axiosInstance.get<
      null,
      AxiosResponse<ApiResponse<UserExportResponse>>
    >(`/users/${pid}/export`);
    if (!response.data.success) {
      throw new Error(
        response.data.errors?.join(", ") || "Failed to export user data"
      );
    }
    return response.data.data;
  } catch (err) {
    throw new Error(
      `Error exporting user data: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
};

/**
 * Hook to fetch all users.
 * @returns A React Query instance for the users.
 */
export const useGetUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: () => fetchUsers(frontendAxios),
  });
};

/**
 * Hook to fetch a user by PID.
 * @param pid The user’s PID.
 * @returns A React Query instance for the user.
 */
export const useGetUserByPid = (pid: string | null) => {
  return useQuery<User, Error>({
    queryKey: ["user", pid],
    queryFn: () => {
      if (!pid) {
        throw new Error("User PID is required");
      }
      return fetchUserByPid(pid, frontendAxios);
    },
    enabled: !!pid,
  });
};

/**
 * Hook to export a user’s data.
 * @param pid The user’s PID.
 * @returns A React Query instance for the export data.
 */
export const useExportUserData = (pid: string | null) => {
  return useQuery<UserExportResponse, Error>({
    queryKey: ["userExport", pid],
    queryFn: () => {
      if (!pid) {
        throw new Error("User PID is required");
      }
      return exportUserData(pid, frontendAxios);
    },
    enabled: !!pid,
  });
};