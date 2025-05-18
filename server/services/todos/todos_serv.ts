import { IUser } from "../../entities/user";
import { INote } from "../../entities/note";
import { UpdateTodoRequest } from "../../entities/todo";
import { ITodo } from "../../entities/todo";
import { CreateTodoRequest } from "../../entities/todo";
import { getErrorMessage } from "../../oplog/error";
import oplog from "../../oplog/oplog";
import { NoteRepository } from "../../repositories/notes/notes_repo";
import { TodoRepository } from "../../repositories/todos/todos_repo";
import { UserRepository } from "../../repositories/users/users_repo";

export async function createTodo(data: CreateTodoRequest): Promise<ITodo | Error> {
	try {
		const user = await UserRepository.findByPid(data.userPid);
		if (user instanceof Error) {
			oplog.error(getErrorMessage(user));
			return user;
		}
		if (!user) {
			oplog.error(`User not found for pid: ${data.userPid}`);
			return new Error("User not found");
		}

		if (data.mentions) {
			const validUsers = await Promise.all(
				data.mentions.map((username) => UserRepository.findByUsername(username.replace("@", "")))
			);
			const invalidUsers = validUsers.some((u) => u instanceof Error || !u);
			if (invalidUsers) {
				oplog.error("Invalid mentioned usernames");
				return new Error("Invalid mentioned usernames");
			}
			data.mentions = validUsers.map((u) => `@${(u as IUser).username}`);
		}

		const todo = await TodoRepository.create(data);
		if (todo instanceof Error) {
			oplog.error(getErrorMessage(todo));
			return todo;
		}
		return todo;
	} catch (error) {
		oplog.error(getErrorMessage(error));
		return error as Error;
	}
}

export async function getTodos(userPid?: string): Promise<Array<ITodo & { notes: INote[] }> | Error> {
	try {
		let todos: ITodo[];
		if (userPid) {
			const user = await UserRepository.findByPid(userPid);
			if (user instanceof Error) {
				oplog.error(getErrorMessage(user));
				return user;
			}
			if (!user) {
				oplog.error(`User not found for pid: ${userPid}`);
				return new Error("User not found");
			}
			const userTodos = await TodoRepository.findByUserPid(userPid);
			if (userTodos instanceof Error) {
				oplog.error(getErrorMessage(userTodos));
				return userTodos;
			}
			todos = userTodos;
		} else {
			const allTodos = await TodoRepository.findAll();
			if (allTodos instanceof Error) {
				oplog.error(getErrorMessage(allTodos));
				return allTodos;
			}
			todos = allTodos;
		}

		const todosWithNotes = await Promise.all(
			todos.map(async (todo) => {
				const notes = await NoteRepository.findByTodoPid(todo.pid);
				if (notes instanceof Error) {
					oplog.error(getErrorMessage(notes));
					return { ...todo.toObject(), notes: [] };
				}
				return { ...todo.toObject(), notes };
			})
		);

		return todosWithNotes;
	} catch (error) {
		oplog.error(getErrorMessage(error));
		return error as Error;
	}
}

export async function getTodoByPid(pid: string): Promise<(ITodo & { notes: INote[] }) | Error> {
	try {
		const todo = await TodoRepository.findByPid(pid);
		if (todo instanceof Error) {
			oplog.error(getErrorMessage(todo));
			return todo;
		}
		if (!todo) {
			oplog.error(`Todo not found for pid: ${pid}`);
			return new Error("Todo not found");
		}

		const notes = await NoteRepository.findByTodoPid(pid);
		if (notes instanceof Error) {
			oplog.error(getErrorMessage(notes));
			return { ...todo.toObject(), notes: [] };
		}

		return { ...todo.toObject(), notes };
	} catch (error) {
		oplog.error(getErrorMessage(error));
		return error as Error;
	}
}

export async function updateTodo(pid: string, data: UpdateTodoRequest): Promise<(ITodo & { notes: INote[] }) | Error> {
	try {
		const todo = await TodoRepository.findByPid(pid);
		if (todo instanceof Error) {
			oplog.error(getErrorMessage(todo));
			return todo;
		}
		if (!todo) {
			oplog.error(`Todo not found for pid: ${pid}`);
			return new Error("Todo not found");
		}

		if (data.mentions) {
			const validUsers = await Promise.all(
				data.mentions.map((username) => UserRepository.findByUsername(username.replace("@", "")))
			);
			const invalidUsers = validUsers.some((u) => u instanceof Error || !u);
			if (invalidUsers) {
				oplog.error("Invalid mentioned usernames");
				return new Error("Invalid mentioned usernames");
			}
			data.mentions = validUsers.map((u) => `@${(u as IUser).username}`);
		}

		const updatedTodo = await TodoRepository.update(pid, data);
		if (updatedTodo instanceof Error) {
			oplog.error(getErrorMessage(updatedTodo));
			return updatedTodo;
		}
		if (!updatedTodo) {
			oplog.error(`Todo not found for pid: ${pid}`);
			return new Error("Todo not found");
		}

		const notes = await NoteRepository.findByTodoPid(pid);
		if (notes instanceof Error) {
			oplog.error(getErrorMessage(notes));
			return { ...updatedTodo.toObject(), notes: [] };
		}

		return { ...updatedTodo.toObject(), notes };
	} catch (error) {
		oplog.error(getErrorMessage(error));
		return error as Error;
	}
}

export async function deleteTodo(pid: string): Promise<void | Error> {
	try {
		const todo = await TodoRepository.findByPid(pid);
		if (todo instanceof Error) {
			oplog.error(getErrorMessage(todo));
			return todo;
		}
		if (!todo) {
			oplog.error(`Todo not found for pid: ${pid}`);
			return new Error("Todo not found");
		}

		const deleted = await TodoRepository.deleteByPid(pid);
		if (deleted instanceof Error) {
			oplog.error(getErrorMessage(deleted));
			return deleted;
		}
		if (!deleted) {
			oplog.error(`Todo not found for pid: ${pid}`);
			return new Error("Todo not found");
		}

		const notesDeleted = await NoteRepository.deleteByTodoPid(pid);
		if (notesDeleted instanceof Error) {
			oplog.error(getErrorMessage(notesDeleted));
			return notesDeleted;
		}

		return;
	} catch (error) {
		oplog.error(getErrorMessage(error));
		return error as Error;
	}
}

export async function toggleTodoCompletion(pid: string): Promise<(ITodo & { notes: INote[] }) | Error> {
	try {
		const todo = await TodoRepository.toggleCompletion(pid);
		if (todo instanceof Error) {
			oplog.error(getErrorMessage(todo));
			return todo;
		}
		if (!todo) {
			oplog.error(`Todo not found for pid: ${pid}`);
			return new Error("Todo not found");
		}

		const notes = await NoteRepository.findByTodoPid(pid);
		if (notes instanceof Error) {
			oplog.error(getErrorMessage(notes));
			return { ...todo.toObject(), notes: [] };
		}

		return { ...todo.toObject(), notes };
	} catch (error) {
		oplog.error(getErrorMessage(error));
		return error as Error;
	}
}

export const TodoService = {
	createTodo,
	getTodos,
	getTodoByPid,
	updateTodo,
	deleteTodo,
	toggleTodoCompletion,
};
