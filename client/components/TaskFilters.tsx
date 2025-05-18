"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TodoFilters, SortOption } from "@/types/api";

interface TaskFiltersProps {
  filters: TodoFilters;
  onFilterChange: (filters: TodoFilters) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function TaskFilters({
  filters,
  onFilterChange,
  sortOption,
  onSortChange,
}: TaskFiltersProps) {
  const handlePriorityChange = (value: 'all' | 'high' | 'medium' | 'low') => {
    onFilterChange({
      ...filters,
      priority: value === 'all' ? undefined : value,
    });
  };

  const handleTagChange = (value: 'all' | 'work' | 'personal' | 'project') => {
    onFilterChange({
      ...filters,
      tag: value === 'all' ? undefined : value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value || undefined,
    });
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
      <div className="flex flex-wrap gap-2 md:gap-3">
        <div className="relative md:block">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="pl-8 w-full md:w-auto"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Select
          value={filters.priority || 'all'}
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.tag || 'all'}
          onValueChange={handleTagChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="project">Project</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Select
          value={sortOption}
          onValueChange={(value: SortOption) => onSortChange(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="priority-desc">Priority (High-Low)</SelectItem>
            <SelectItem value="priority-asc">Priority (Low-High)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}