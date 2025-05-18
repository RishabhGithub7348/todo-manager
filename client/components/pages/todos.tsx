"use client"

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import CreateEditTaskModal from "@/components/tasks/CreateEditTaskModal";
import TaskNotesModal from "@/components/tasks/TaskNotesModal";
import { useToast } from "@/hooks/use-toast";
import { SortOption, TodoFilters, CreateNoteRequest, Todo, CreateTodoRequest, UpdateTodoRequest } from "@/types/api";
import Header from "../header/header";
import { useGetUsers } from "@/providers/user";
import { useCreateTodo, useDeleteTodo, useGetTodos, useToggleTodoCompletion, useUpdateTodo } from "@/providers/todos";
import { useCreateNote } from "@/providers/notes";
import { useUser } from "@/context/userContext";
import { exportTodos } from "@/utils/exportData";


export default function TodosPage() {
  const { currentUser } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Todo | null>(null);
  const [filters, setFilters] = useState<TodoFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();

  // Apply search term to filters
  useEffect(() => {
   
      setFilters(prev => ({ ...prev, search: searchTerm }));

  }, [searchTerm]);

  // Query for users
  const { data: users, error: usersError } = useGetUsers();

  // Query for todos
  const { data: todos, isLoading: todosLoading, error: todosError } = useGetTodos(
    currentUser?.pid
  );

  // Create todo mutation
  const { mutate: createTodo, isLoading: creatingTodo } = useCreateTodo();
  const { mutate: updateTodo, isLoading: updatingTodo } = useUpdateTodo();
  const { mutateAsync: deleteTodo, } = useDeleteTodo();
  const { mutate: toggleTodoCompletion, } = useToggleTodoCompletion();
  const { mutate: createNote, isLoading: creatingNote } = useCreateNote();

  // Handle errors
  useEffect(() => {
    if (usersError) {
      toast({
        title: "Error fetching users",
        description: usersError.message,
        variant: "destructive",
      });
    }
    if (todosError) {
      toast({
        title: "Error fetching todos",
        description: todosError.message,
        variant: "destructive",
      });
    }
  }, [usersError, todosError, toast]);

  const handleSaveTask = (taskData: Partial<Todo>) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please select a user first",
        variant: "destructive",
      });
      return;
    }

    if (currentTask) {
      // For updating an existing task
      const updateData: UpdateTodoRequest = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        completed: taskData.completed,
        tags: taskData.tags,
        mentions: taskData.mentions,
      };

      updateTodo(
        { pid: currentTask.pid, data: updateData },
        {
          onSuccess: () => {
            setIsCreateTaskModalOpen(false);
            setCurrentTask(null);
            toast({
              title: "Task updated",
              description: "Your task has been updated successfully",
            });
          },
          onError: (error) => {
            toast({
              title: "Error updating task",
              description: error instanceof Error ? error.message : "Error updating task",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      // For creating a new task, ensure title is provided
      if (!taskData.title) {
        toast({
          title: "Error",
          description: "Task title is required",
          variant: "destructive",
        });
        return;
      }

      // Now we can safely cast to CreateTodoRequest since we've verified title exists
      const createTodoData: CreateTodoRequest = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        userPid: currentUser.pid,
        tags: taskData.tags,
        mentions: taskData.mentions,
      };

      createTodo(createTodoData, {
        onSuccess: () => {
          setIsCreateTaskModalOpen(false);
          toast({
            title: "Task created",
            description: "Your task has been created successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error creating task",
            description: error instanceof Error ? error.message : "Error creating task",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleDeleteTask = async (pid: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTodo(pid);
        toast({
          title: "Task deleted",
          description: "Your task has been deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error deleting task",
          description: error instanceof Error ? error.message : "An error occurred",
          variant:"default",
        });
      }
    }
  };

  const handleToggleCompletion = (pid: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      toggleTodoCompletion(pid, {
        onSuccess: () => {
          toast({
            title: "Task updated",
            description: "Task completion status updated",
          });
          resolve();
        },
        onError: (error) => {
          toast({
            title: "Error updating task",
            description: "Error updating task",
            variant: "destructive",
          });
          reject(error);
        },
      });
    });
  };

  const handleEditTask = (todo: Todo) => {
    setCurrentTask(todo);
    setIsCreateTaskModalOpen(true);
  };

  const handleAddNotes = (todo: Todo) => {
    setCurrentTask(todo);
    setIsNotesModalOpen(true);
  };

  const handleCreateNote = (noteData: CreateNoteRequest) => {
    if (!currentUser || !currentTask) {
      toast({
        title: "Error",
        description: "User or task not selected",
        variant: "destructive",
      });
      return;
    }

    createNote(noteData, {
      onSuccess: () => {
        setIsNotesModalOpen(false);
        toast({
          title: "Note added",
          description: "Your note has been added successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error adding note",
          description: "Error adding note",
          variant: "destructive",
        });
      },
    });
  };

  const handleExportTodos = () => {
    if (!todos || todos.length === 0) {
      toast({
        title: "No tasks to export",
        description: "Please create some tasks first",
        variant: "destructive",
      });
      return;
    }
    try {
      exportTodos(todos, `todos-${currentUser?.username || "user"}`);
      toast({
        title: "Tasks exported",
        description: "Your tasks have been exported as a CSV file",
      });
    } catch (error) {
      toast({
        title: "Error exporting tasks",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onTagFilter={(tag) => setFilters(prev => ({ ...prev, tag }))}
        onExport={handleExportTodos}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="My Tasks"
          onCreateTask={() => {
            setCurrentTask(null);
            setIsCreateTaskModalOpen(true);
          }}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
        />

        <TaskList
          todos={todos || []}
          isLoading={todosLoading}
          currentUser={currentUser}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onAddNotes={handleAddNotes}
          onToggleComplete={handleToggleCompletion}
          filters={filters}
          onFilterChange={setFilters}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />
      </div>

      <CreateEditTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => {
          setIsCreateTaskModalOpen(false);
          setCurrentTask(null);
        }}
        onSave={handleSaveTask}
        users={users || []}
        currentTask={currentTask}
        currentUser={currentUser}
        isSaving={creatingTodo || updatingTodo}
      />

      <TaskNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false);
          setCurrentTask(null);
        }}
        todo={currentTask}
        currentUser={currentUser}
        onSaveNote={handleCreateNote}
        isSaving={creatingNote}
      />
    </div>
  );
}