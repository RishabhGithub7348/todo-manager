"use client"

import { User } from "@/types/api";


interface UserDropdownProps {
  users: User[];
  onSelectUser: (username: string) => void;
}

export default function UserDropdown({ users, onSelectUser }: UserDropdownProps) {
  if (users.length === 0) {
    return (
      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-sm">
        <div className="user-option select-none relative py-2 pl-3 pr-9 text-gray-400 italic">
          No users found
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-sm overflow-auto focus:outline-none">
      {users.map((user) => (
        <div
          key={user.pid}
          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
          onClick={() => onSelectUser(user.username)}
        >
          <div className="flex items-center">
            <span className="font-medium text-gray-900">@{user.username}</span>
            <span className="ml-2 text-xs text-gray-500">({user.displayName})</span>
          </div>
        </div>
      ))}
    </div>
  );
}
