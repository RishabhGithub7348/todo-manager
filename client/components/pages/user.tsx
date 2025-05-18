"use client"

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Header from "@/components/header/header";
import { useGetUsers } from "@/providers/user";
import { useGetTodos } from "@/providers/todos";
import { useUser } from "@/context/userContext";
import { exportTodos } from "@/utils/exportData";


export default function UsersPage() {
  const { currentUser, setCurrentUser } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Fetch users
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useGetUsers();

  // Fetch todos for the selected user
  const { data: todos, isLoading: isLoadingTodos, error: todosError } = useGetTodos(
    currentUser?.pid
  );

  // Handle query errors
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

  const getUserInitials = (displayName: string) => {
    return displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  const getPriorityCount = (priority: string) => {
    if (!todos) return 0;
    return todos.filter(todo => todo.priority === priority).length;
  };

  const getCompletedCount = () => {
    if (!todos) return 0;
    return todos.filter(todo => todo.completed).length;
  };

  const getTagStats = () => {
    if (!todos || todos.length === 0) return {};

    const stats: Record<string, number> = {};
    todos.forEach(todo => {
      if (todo.tags) {
        todo.tags.forEach(tag => {
          stats[tag] = (stats[tag] || 0) + 1;
        });
      }
    });
    return stats;
  };

  // Generate a consistent color for tags based on tag name
  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-green-500',
      'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const tagStats = getTagStats();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onTagFilter={() => {}} // Placeholder; implement if needed
        onExport={handleExportTodos}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Users"
          onCreateTask={() => {}} // Disabled for UsersPage
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onSearch={() => {}} // Disabled for UsersPage
          searchTerm=""
        />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {isLoadingUsers ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="bg-white animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="h-20"></CardContent>
                </Card>
              ))
            ) : users && users.length > 0 ? (
              users.map(user => (
                <Card 
                  key={user.pid} 
                  className={`overflow-hidden transition-all ${
                    currentUser?.pid === user.pid ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Avatar className="h-9 w-9 bg-gray-400 text-gray-700">
                          <AvatarFallback>{getUserInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                        {user.displayName}
                      </CardTitle>
                      <Badge variant="outline" className="font-normal">
                        @{user.username}
                      </Badge>
                    </div>
                    <CardDescription>
                      {currentUser?.pid === user.pid ? 'Current user' : 'Click to view tasks'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Button 
                      variant={currentUser?.pid === user.pid ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => setCurrentUser(user)}
                    >
                      {currentUser?.pid === user.pid ? 'Current Selected' : 'Select User'}
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="text-center py-6 text-gray-500">
                  No users found
                </CardContent>
              </Card>
            )}
          </div>

          {currentUser && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">User Details: {currentUser.displayName}</CardTitle>
                <CardDescription>View task statistics and details</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTodos ? (
                  <div className="text-center py-6">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                ) : (
                  <Tabs defaultValue="stats">
                    <TabsList className="mb-4">
                      <TabsTrigger value="stats">Statistics</TabsTrigger>
                      <TabsTrigger value="tasks">Recent Tasks</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="stats">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Priority Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              <li className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                  <span>High</span>
                                </div>
                                <Badge variant="outline">{getPriorityCount('high')}</Badge>
                              </li>
                              <li className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                  <span>Medium</span>
                                </div>
                                <Badge variant="outline">{getPriorityCount('medium')}</Badge>
                              </li>
                              <li className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                  <span>Low</span>
                                </div>
                                <Badge variant="outline">{getPriorityCount('low')}</Badge>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Completion Status</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className="text-3xl font-bold">
                                {getCompletedCount()}/{todos?.length || 0}
                              </div>
                              <div className="text-sm text-gray-500">Tasks Completed</div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Tag Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {Object.entries(tagStats).map(([tag, count]) => (
                                <li key={tag} className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full ${getTagColor(tag)} mr-2`}></div>
                                    <span className="capitalize">{tag}</span>
                                  </div>
                                  <Badge variant="outline">{count}</Badge>
                                </li>
                              ))}
                              {Object.keys(tagStats).length === 0 && (
                                <li className="text-center text-gray-500 italic">No tags used</li>
                              )}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="tasks">
                      {todos && todos.length > 0 ? (
                        <ScrollArea className="h-60">
                          <div className="space-y-2">
                            {todos.slice(0, 10).map(todo => (
                              <div key={todo.pid} className="p-3 border rounded">
                                <div className="flex justify-between">
                                  <div className="font-medium">{todo.title}</div>
                                  <div className="text-xs text-gray-500">
                                   {todo?.createdAt ? format(new Date(todo.createdAt), 'MMM dd, yyyy') : 'N/A'}

                                  </div>
                                </div>
                                {todo.description && (
                                  <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                                    {todo.description}
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  <Badge variant="outline" className={
                                    todo.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }>
                                    {todo.priority}
                                  </Badge>
                                  {todo.completed && (
                                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No tasks found for this user
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleExportTodos}
                  className="w-full"
                  disabled={isLoadingTodos}
                >
                  Export User Tasks
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}