"use client"

import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Edit, Trash2, StickyNote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Todo } from "@/types/api";
import { useGetUsers } from "@/providers/user";


interface TaskCardProps {
  todo: Todo;
  onEdit: () => void;
  onDelete: () => void;
  onAddNotes: () => void;
  onToggleComplete: () => Promise<void>;
}

export default function TaskCard({
  todo,
  onEdit,
  onDelete,
  onAddNotes,
  onToggleComplete,
}: TaskCardProps) {
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  // Fetch users
  const { data: users, error: usersError } = useGetUsers();

  // Handle fetch errors
  useEffect(() => {
    if (usersError) {
      toast({
        title: "Error fetching users",
        description: usersError.message,
        variant: "destructive",
      });
    }
  }, [usersError, toast]);

  const getBorderColorByPriority = () => {
    switch (todo.priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  const getPriorityBadge = () => {
    switch (todo.priority) {
      case 'high':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  // Dynamic tag color function (similar to UsersPage)
  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-orange-100 text-orange-700 border-orange-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-green-100 text-green-700 border-green-200',
      'bg-red-100 text-red-700 border-red-200',
      'bg-yellow-100 text-yellow-700 border-yellow-200',
      'bg-pink-100 text-pink-700 border-pink-200',
      'bg-teal-100 text-teal-700 border-teal-200',
    ];
    const hash = tag.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getTagBadge = (tag: string) => {
    return (
      <Badge variant="outline" className={getTagColor(tag)}>
        {tag.charAt(0).toUpperCase() + tag.slice(1)}
      </Badge>
    );
  };

  const getUserDisplayName = (username: string) => {
    // Remove leading @ from username
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    const user = users?.find(user => user.username === cleanUsername);
    return user ? user.displayName : cleanUsername;
  };

  const handleToggleComplete = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete();
    } catch (error) {
      toast({
        title: "Error toggling task",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${getBorderColorByPriority()} ${
        todo.completed ? 'opacity-70' : ''
      }`}
    >
      <div className="flex flex-wrap md:flex-nowrap justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggleComplete}
                className="h-4 w-4"
                disabled={isToggling}
              />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <h3
                className={`text-base font-medium leading-tight truncate ${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{todo.description}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {getPriorityBadge()}

                {todo.tags && todo.tags.map((tag, index) => (
                  <div key={index}>{getTagBadge(tag)}</div>
                ))}

                {todo.mentions && todo.mentions.map((username, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {getUserDisplayName(username)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 md:space-x-3 w-full md:w-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onAddNotes}
                  className="text-gray-400 hover:text-purple-500"
                  disabled={isToggling}
                >
                  <StickyNote className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Notes</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onEdit}
                  className="text-gray-400 hover:text-blue-500"
                  disabled={isToggling}
                >
                  <Edit className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Task</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onDelete}
                  className="text-gray-400 hover:text-red-500"
                  disabled={isToggling}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-xs text-gray-400">
            {todo?.createdAt ? format(new Date(todo.createdAt), 'MMM dd, yyyy') : 'N/A'}

          </span>
        </div>
      </div>
    </div>
  );
}