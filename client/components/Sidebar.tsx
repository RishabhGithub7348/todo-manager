"use client"

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Download, List, Users } from "lucide-react";
import UserSelector from "./UserSelector";

import { useToast } from "@/hooks/use-toast";
import { Todo } from "@/types/api";
import { usePathname } from "next/navigation";
import { useGetTodos } from "@/providers/todos";
import Link from "next/link";
import { useUser } from "@/context/userContext";


// Define Tag type locally to match usage
interface Tag {
  name: string;
  count: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onTagFilter: (tag: string) => void;
  onExport: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  onTagFilter,
  onExport,
}: SidebarProps) {
  
  const pathname = usePathname();
  const { toast } = useToast();
  const [tags, setTags] = useState<Tag[]>([
    { name: "Work", count: 0 },
    { name: "Personal", count: 0 },
    { name: "Project", count: 0 },
  ]);

   const { currentUser } = useUser();


  // Fetch todos for tag counts
  const { data: todos, error: todosError } = useGetTodos(currentUser?.pid);
 
  // Handle fetch errors
  useEffect(() => {
    if (todosError) {
      toast({
        title: "Error fetching todos",
        description: todosError.message,
        variant: "destructive",
      });
    }
  }, [todosError, toast]);

  // Update tag counts when todos change
  useEffect(() => {
  if (!todos) return;

  // Calculate tag counts from todos
  const tagCounts = new Map<string, number>();
  todos.forEach((todo: Todo) => {
    if (todo.tags) {
      todo.tags.forEach((tag: string) => {
        tagCounts.set(tag.toLowerCase(), (tagCounts.get(tag.toLowerCase()) || 0) + 1);
      });
    }
  });

  // Update tags with counts
  setTags(prevTags => 
    prevTags.map(tag => ({
      ...tag,
      count: tagCounts.get(tag.name.toLowerCase()) || 0,
    }))
  );
}, [todos]); 

  const sidebarClasses = `bg-white shadow-lg w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 absolute inset-y-0 left-0 z-30 h-full ${
    isOpen ? "" : "-translate-x-full lg:translate-x-0"
  }`;

  return (
    <div className={sidebarClasses}>
      {/* App Brand */}
      <div className="flex items-center justify-between px-4 py-5 border-b">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <h1 className="text-xl font-bold">TaskMaster</h1>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* User Selector */}
      <div className="px-4 py-4 border-b">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Current User
        </h2>
        <UserSelector />
      </div>

      {/* Navigation */}
      <nav className="px-2 py-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
          Navigation
        </h2>
        <ul>
          <li className="mb-1">
            <Link
              href="/"
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                pathname === "/" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className={`mr-3 h-4 w-4 ${pathname === "/" ? "text-blue-600" : ""}`} />
              <span>My Tasks</span>
            </Link>
          </li>
          <li className="mb-1">
            <Link
              href="/users"
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                pathname === "/users" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className={`mr-3 h-4 w-4 ${pathname === "/users" ? "text-blue-600" : ""}`} />
              <span>Users</span>
            </Link>
          </li>
        </ul>

        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-2">
          Tags
        </h2>
        <ul className="space-y-1">
          {tags.map((tag, index) => (
            <li key={index}>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-sm rounded-md text-gray-600 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  onTagFilter(tag.name.toLowerCase());
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    index === 0 ? "bg-primary" : index === 1 ? "bg-orange-500" : "bg-purple-500"
                  } mr-2`}
                ></span>
                <span>{tag.name}</span>
                <span className="ml-auto text-xs text-gray-400">{tag.count}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t px-4 py-3 mt-auto">
        <Button
          onClick={onExport}
          variant="outline"
          className="w-full flex items-center justify-center border-primary text-primary hover:bg-primary hover:text-white"
          disabled={!currentUser}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Tasks
        </Button>
      </div>
    </div>
  );
}