"use client";

import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/context/userContext";
import { useGetUsers } from "@/providers/user";


export default function UserSelector() {
  const { currentUser, setCurrentUser } = useUser();
  const { data: users, isLoading, error } = useGetUsers();

  // Set the first user as default when users are loaded, if no currentUser
  useEffect(() => {
    if (users && users.length > 0 && !currentUser) {
      setCurrentUser(users[0]);
    }
  }, [users, currentUser, setCurrentUser]);

  const handleUserChange = (pid: string) => {
    if (!users) return;
    const selectedUser = users.find(user => user.pid === pid) || null;
    setCurrentUser(selectedUser);
  };

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading users..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (error) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Error loading users" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={currentUser?.pid || ""}
      onValueChange={handleUserChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {users?.map((user) => (
          <SelectItem key={user.pid} value={user.pid}>
            {user.displayName || user.username}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}