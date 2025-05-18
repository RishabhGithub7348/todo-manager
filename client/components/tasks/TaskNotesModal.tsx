"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormEvent, useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CreateNoteRequest, Todo, User } from "@/types/api";
import { useGetNotesByTodoPid } from "@/providers/notes";
import { useGetUsers } from "@/providers/user";


interface TaskNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
  currentUser: User | null;
  onSaveNote: (noteData: CreateNoteRequest) => void;
  isSaving: boolean;
}

export default function TaskNotesModal({
  isOpen,
  onClose,
  todo,
  currentUser,
  onSaveNote,
  isSaving,
}: TaskNotesModalProps) {
  const [noteContent, setNoteContent] = useState("");
  const { toast } = useToast();

  // Fetch notes for the current todo
  const { data: notes, isLoading: isLoadingNotes, error: notesError } = useGetNotesByTodoPid(
    todo?.pid || null
  );

  // Fetch users for displaying who added notes
  const { data: users, error: usersError } = useGetUsers();

  // Handle query errors
  useEffect(() => {
    if (notesError) {
      toast({
        title: "Error fetching notes",
        description: notesError.message,
        variant: "destructive",
      });
    }
    if (usersError) {
      toast({
        title: "Error fetching users",
        description: usersError.message,
        variant: "destructive",
      });
    }
  }, [notesError, usersError, toast]);

  // Reset note content when modal opens
  useEffect(() => {
    if (isOpen) {
      setNoteContent("");
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!todo || !currentUser || !noteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content, todo, or user is missing",
        variant: "destructive",
      });
      return;
    }

    const noteData: CreateNoteRequest = {
      content: noteContent,
      todoPid: todo.pid,
      userPid: currentUser.pid,
    };

    onSaveNote(noteData);
  };

  const getUserDisplayName = (userPid: string) => {
    const user = users?.find(user => user.pid === userPid);
    return user ? user.displayName : "Unknown User";
  };

  const getPriorityText = () => {
    switch (todo?.priority) {
      case 'high': return <span className="font-medium text-red-500">High</span>;
      case 'medium': return <span className="font-medium text-yellow-500">Medium</span>;
      case 'low': return <span className="font-medium text-green-500">Low</span>;
      default: return <span className="font-medium">Normal</span>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Task Notes</DialogTitle>
        </DialogHeader>

        {todo ? (
          <div className="py-2">
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">
                Task: <span className="font-normal">{todo.title}</span>
              </h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  Priority: {getPriorityText()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Created: <span className="font-medium">
                    {todo?.createdAt ? format(new Date(todo.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Existing Notes</h4>
              {isLoadingNotes ? (
                <div className="space-y-2">
                  <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
                  <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
                </div>
              ) : notes && notes.length > 0 ? (
                <ScrollArea className="max-h-40">
                  <div className="space-y-3">
                    {notes.map(note => (
                      <div key={note.pid} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-gray-800">{note.content}</p>
                          <span className="text-xs text-gray-500">
                            {format(new Date(note.createdAt), 'MMM dd')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Added by: {getUserDisplayName(note.userPid)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-gray-500 italic py-2">No notes added yet</p>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="noteContent">Add Note</Label>
                <Textarea
                  id="noteContent"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter your note"
                  rows={3}
                  required
                />
              </div>

              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving || !noteContent.trim() || !currentUser}
                >
                  {isSaving ? "Adding..." : "Add Note"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        ) : (
          <div className="py-2">
            <p className="text-sm text-gray-500 italic">No task selected</p>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}