import { getErrorMessage } from "../../oplog/error";
import { IUser } from "../../entities/user";
import { UserRepository } from "../../repositories/users/users_repo";
import oplog from "../../oplog/oplog";
import { TodoRepository } from "../../repositories/todos/todos_repo";
import { NoteRepository } from "../../repositories/notes/notes_repo";
import { ITodo } from "../../entities/todo";
import { INote } from "../../entities/note";


export async function getAllUsers(): Promise<IUser[] | Error> {
  try {
    const users = await UserRepository.findAll();
    if (users instanceof Error) {
      oplog.error(getErrorMessage(users));
      return users;
    }
    return users;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function getUserByPid(pid: string): Promise<IUser | Error> {
  try {
    const user = await UserRepository.findByPid(pid);
    if (user instanceof Error) {
      oplog.error(getErrorMessage(user));
      return user;
    }
    if (!user) {
      oplog.error(`User not found for pid: ${pid}`);
      return new Error('User not found');
    }
    return user;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

// export async function exportUserTodos(pid: string): Promise<{ user: IUser; todos: Array<ITodo & { notes: INote[] }>; exportDate: string } | Error> {
//   try {
//     const user = await UserRepository.findByPid(pid);
//     if (user instanceof Error) {
//       oplog.error(getErrorMessage(user));
//       return user;
//     }
//     if (!user) {
//       oplog.error(`User not found for pid: ${pid}`);
//       return new Error('User not found');
//     }

//     const todos = await TodoRepository.findByUserPid(pid);
//     if (todos instanceof Error) {
//       oplog.error(getErrorMessage(todos));
//       return todos;
//     }

//     const todosWithNotes = await Promise.all(
//       todos.map(async (todo:any) => {
//         const notes = await NoteRepository.findByTodoPid(todo.pid);
//         if (notes instanceof Error) {
//           oplog.error(getErrorMessage(notes));
//           return { ...todo.toObject(), notes: [] };
//         }
//         return { ...todo.toObject(), notes };
//       })
//     );

//     return {
//       user: { pid: user.pid, username: user.username, displayName: user.displayName },
//       todos: todosWithNotes,
//       exportDate: new Date().toISOString(),
//     };
//   } catch (error) {
//     oplog.error(getErrorMessage(error));
//     return error as Error;
//   }
// }

export const UserService = {
  getAllUsers,
  getUserByPid,
//   exportUserTodos,
};