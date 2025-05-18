import { Todo } from "@/types/api";

export const exportTodos = (todos: Todo[], filenamePrefix: string = "todos") => {
  // Define CSV headers
  const headers = ["Title", "Description", "Priority", "Completed", "Tags", "Created At"];

  // Convert todos to CSV rows
  const rows = todos.map(todo => {
    const row = [
      `"${todo.title.replace(/"/g, '""')}"`, // Escape quotes for CSV
      todo.description ? `"${todo.description.replace(/"/g, '""')}"` : "",
      todo.priority || "",
      todo.completed ? "Yes" : "No",
      todo.tags?.join(", ") || "",
      todo.createdAt ? new Date(todo.createdAt).toLocaleString() : "", // Handle undefined createdAt
    ];
    return row.join(",");
  });

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows].join("\n");

  // Create a Blob for download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link to trigger download
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.setAttribute("download", `${filenamePrefix}-${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};