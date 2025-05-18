"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormEvent, useEffect, useState, useRef } from "react";
import UserDropdown from "./UserDropdown";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Todo, User } from "@/types/api";

interface CreateEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Todo>) => void;
  users: User[];
  currentTask: Todo | null;
  currentUser: User | null;
  isSaving: boolean;
}

export default function CreateEditTaskModal({
  isOpen,
  onClose,
  onSave,
  users,
  currentTask,
  currentUser,
  isSaving,
}: CreateEditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<'medium' | 'high' | 'low'>("medium");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const [mentionInput, setMentionInput] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description || "");
      setPriority(currentTask.priority);
      setSelectedTags(currentTask.tags || []);
      setMentionedUsers(currentTask.mentions || []);
    } else if (isOpen) {
      // Reset form for new task
      setTitle("");
      setDescription("");
      setPriority("medium");
      setSelectedTags([]);
      setMentionedUsers([]);
    }
  }, [isOpen, currentTask]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const taskData: Partial<Todo> = {
      title,
      description: description || undefined,
      priority,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      mentions: mentionedUsers.length > 0 ? mentionedUsers : undefined,
      userPid: currentUser?.pid,
    };

    onSave(taskData);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleMentionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMentionInput(value);

    if (value.startsWith('@') && value.length > 1) {
      setShowUserDropdown(true);
    } else {
      setShowUserDropdown(false);
    }
  };

  const handleAddMention = (username: string) => {
    const formattedUsername = `@${username}`;
    if (!mentionedUsers.includes(formattedUsername)) {
      setMentionedUsers(prev => [...prev, formattedUsername]);
    }
    setMentionInput("");
    setShowUserDropdown(false);

    // Focus the input after adding a mention
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeMention = (username: string) => {
    setMentionedUsers(prev => prev.filter(u => u !== username));
  };

  const filterUsers = () => {
    const searchTerm = mentionInput.startsWith('@')
      ? mentionInput.substring(1).toLowerCase()
      : mentionInput.toLowerCase();

    return users
      .filter(user =>
        !mentionedUsers.includes(`@${user.username}`) &&
        user.username.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5); // Limit to 5 results
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value: 'medium' | 'high' | 'low') => setPriority(value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              {/* TODO: Consider dynamic tags from backend or user input */}
              <div className="flex flex-wrap gap-2 mt-1">
                <div className="inline-block">
                  <label className="inline-flex items-center cursor-pointer">
                    <Checkbox
                      checked={selectedTags.includes("work")}
                      onCheckedChange={() => handleTagToggle("work")}
                    />
                    <span className="ml-2 text-sm text-gray-700">Work</span>
                  </label>
                </div>
                <div className="inline-block">
                  <label className="inline-flex items-center cursor-pointer">
                    <Checkbox
                      checked={selectedTags.includes("personal")}
                      onCheckedChange={() => handleTagToggle("personal")}
                    />
                    <span className="ml-2 text-sm text-gray-700">Personal</span>
                  </label>
                </div>
                <div className="inline-block">
                  <label className="inline-flex items-center cursor-pointer">
                    <Checkbox
                      checked={selectedTags.includes("project")}
                      onCheckedChange={() => handleTagToggle("project")}
                    />
                    <span className="ml-2 text-sm text-gray-700">Project</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentions">Mention Users</Label>
              <div className="border rounded-md p-2 bg-gray-50 relative">
                <div className="flex flex-wrap gap-2 mb-2">
                  {mentionedUsers.map((username, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {username}
                      <button
                        type="button"
                        onClick={() => removeMention(username)}
                        className="ml-1 rounded-full hover:bg-gray-200 inline-flex items-center justify-center h-4 w-4"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="mentions"
                  ref={inputRef}
                  value={mentionInput}
                  onChange={handleMentionInputChange}
                  placeholder="Type @ to mention a user"
                  className="border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent text-sm"
                />

                {showUserDropdown && (
                  <UserDropdown
                    users={filterUsers()}
                    onSelectUser={handleAddMention}
                  />
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !title.trim()}>
              {isSaving ? 'Saving...' : 'Save Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}