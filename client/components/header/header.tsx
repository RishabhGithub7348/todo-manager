"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  onCreateTask: () => void;
  onOpenSidebar: () => void;
  onSearch: (term: string) => void;
  searchTerm: string;
}

export default function Header({
  title,
  onCreateTask,
  onOpenSidebar,
  onSearch,
  searchTerm
}: HeaderProps) {
  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden mr-2 text-gray-600 p-1 hover:bg-gray-100 rounded-md"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center space-x-3">
        <div className="relative md:block hidden">
          <Input
            type="text"
            placeholder="Search tasks..."
            className="pl-8 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Button 
          onClick={onCreateTask} 
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Add Task</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </header>
  );
}
