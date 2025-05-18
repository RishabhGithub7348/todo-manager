"use client"

import { TodoFilters, SortOption, PaginationInfo, Todo, User } from "@/types/api";
import TaskCard from "./TaskCard";
import TaskFilters from "./TaskFilters";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";

interface TaskListProps {
  todos: Todo[] | undefined;
  isLoading: boolean;
  currentUser: User | null;
  onEdit: (todo: Todo) => void;
  onDelete: (pid: string) => void;
  onAddNotes: (todo: Todo) => void;
  onToggleComplete: (pid: string) => Promise<void>;
  filters: TodoFilters;
  onFilterChange: (filters: TodoFilters) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function TaskList({
  todos,
  isLoading,
  onEdit,
  onDelete,
  onAddNotes,
  onToggleComplete,
  filters,
  onFilterChange,
  sortOption,
  onSortChange,
}: TaskListProps) {
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [paginatedTodos, setPaginatedTodos] = useState<Todo[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  });

  // Apply filters and sorting
  useEffect(() => {
    if (!todos) {
      setFilteredTodos([]);
      setPagination(prev => ({
        ...prev,
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
      }));
      return;
    }

    let result = [...todos];

    // Apply priority filter
    if (filters.priority) {
      result = result.filter(todo => todo.priority === filters.priority);
    }

    // Apply tag filter
    if (filters.tag) {
      result = result.filter(todo => todo.tags?.includes(filters.tag as string));
    }
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result = result.sort((a, b) => {
      switch (sortOption) {
        case 'date-asc':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'date-desc':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'priority-asc':
          return priorityToNumber(a.priority) - priorityToNumber(b.priority);
        case 'priority-desc':
          return priorityToNumber(b.priority) - priorityToNumber(a.priority);
        default:
          return 0;
      }
    });

    setFilteredTodos(result);
    setPagination(prev => ({
      ...prev,
      totalItems: result.length,
      totalPages: Math.max(1, Math.ceil(result.length / prev.itemsPerPage)),
      currentPage: 1, // Reset to first page when filters change
    }));
  }, [todos, filters, sortOption]);

  // Apply pagination
  useEffect(() => {
    const { currentPage, itemsPerPage } = pagination;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedTodos(filteredTodos.slice(start, end));
  }, [filteredTodos, pagination.currentPage, pagination]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Helper function for priority sorting
  const priorityToNumber = (priority: 'high' | 'medium' | 'low'): number => {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <TaskFilters
        filters={filters}
        onFilterChange={onFilterChange}
        sortOption={sortOption}
        onSortChange={onSortChange}
      />

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-300 animate-pulse"
            >
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedTodos.length > 0 ? (
              paginatedTodos.map(todo => (
                <TaskCard
                  key={todo.pid}
                  todo={todo}
                  onEdit={() => onEdit(todo)}
                  onDelete={() => onDelete(todo.pid)}
                  onAddNotes={() => onAddNotes(todo)}
                  onToggleComplete={() => onToggleComplete(todo.pid)}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-medium text-gray-700">No tasks found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or create a new task</p>
              </div>
            )}
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}