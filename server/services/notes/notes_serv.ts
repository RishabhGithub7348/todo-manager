import { INote } from "../../entities/note";
import { CreateNoteRequest } from "../../entities/note";
import { getErrorMessage } from "../../oplog/error";
import oplog from "../../oplog/oplog";
import { NoteRepository } from "../../repositories/notes/notes_repo";
import { TodoRepository } from "../../repositories/todos/todos_repo";
import { UserRepository } from "../../repositories/users/users_repo";


export async function createNote(data: CreateNoteRequest): Promise<INote | Error> {
  try {
    const todo = await TodoRepository.findByPid(data.todoPid);
    if (todo instanceof Error) {
      oplog.error(getErrorMessage(todo));
      return todo;
    }
    if (!todo) {
      oplog.error(`Todo not found for pid: ${data.todoPid}`);
      return new Error('Todo not found');
    }

    const user = await UserRepository.findByPid(data.userPid);
    if (user instanceof Error) {
      oplog.error(getErrorMessage(user));
      return user;
    }
    if (!user) {
      oplog.error(`User not found for pid: ${data.userPid}`);
      return new Error('User not found');
    }

    const note = await NoteRepository.create(data);
    if (note instanceof Error) {
      oplog.error(getErrorMessage(note));
      return note;
    }
    return note;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function getNotesByTodoPid(todoPid: string): Promise<INote[] | Error> {
  try {
    const todo = await TodoRepository.findByPid(todoPid);
    if (todo instanceof Error) {
      oplog.error(getErrorMessage(todo));
      return todo;
    }
    if (!todo) {
      oplog.error(`Todo not found for pid: ${todoPid}`);
      return new Error('Todo not found');
    }

    const notes = await NoteRepository.findByTodoPid(todoPid);
    if (notes instanceof Error) {
      oplog.error(getErrorMessage(notes));
      return notes;
    }
    return notes;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export const NoteService = {
  createNote,
  getNotesByTodoPid,
};