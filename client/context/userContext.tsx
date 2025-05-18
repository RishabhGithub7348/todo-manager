"use client";

import { User } from "@/types/api";
import { createContext, useCallback, useContext, useEffect, useState } from "react";


interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  // Load currentUser from localStorage on mount
  useEffect(() => {
    const savedPid = localStorage.getItem("currentUserPid");
    if (savedPid) {
      // Optionally fetch user by pid or rely on UsersPage to set
      setCurrentUserState({ pid: savedPid } as User); // Placeholder; fetch user if needed
    }
  }, []);

  // Persist currentUser to localStorage
  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(prev => {
      if (prev?.pid === user?.pid) return prev; // Prevent unnecessary updates
      if (user) {
        localStorage.setItem("currentUserPid", user.pid);
      } else {
        localStorage.removeItem("currentUserPid");
      }
      return user;
    });
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};