import { SortOption, Todo, TodoFilters } from "@/types/api";


// Apply filters to todos
export function filterTodos(todos: Todo[], filters: TodoFilters): Todo[] {
  if (!todos) return [];
  
  let result = [...todos];
  
  // Apply priority filter
  if (filters.priority) {
    result = result.filter(todo => todo.priority === filters.priority);
  }
  
  // Apply tag filter
  if (filters.tag) {
    result = result.filter(todo => 
      todo.tags?.includes(filters.tag!)
    );
  }
  
  // Apply user filter
  if (filters.user) {
    result = result.filter(todo => 
      todo.mentions?.includes(filters.user!)
    );
  }
  
  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(todo => 
      todo.title.toLowerCase().includes(searchLower) || 
      (todo.description?.toLowerCase().includes(searchLower) || false)
    );
  }
  
  return result;
}

// Apply sorting to todos
export function sortTodos(todos: Todo[], sortOption: SortOption): Todo[] {
  if (!todos) return [];
  
  const result = [...todos];
  
  // Apply sorting
  return result.sort((a, b) => {
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
}

// Helper function for priority sorting
export function priorityToNumber(priority: string): number {
  switch (priority) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
}

// Get tag counts from todos
export function getTagCounts(todos: Todo[]): Record<string, number> {
  const tagCounts: Record<string, number> = {};
  
  todos.forEach(todo => {
    if (todo.tags && todo.tags.length > 0) {
      todo.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  return tagCounts;
}
