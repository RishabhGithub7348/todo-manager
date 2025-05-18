import { TodoModel, ITodo, CreateTodoRequest } from '../../entities/todo';
import oplog from "../../oplog/oplog";

import { getErrorMessage } from "../../oplog/error";

export async function create(data: CreateTodoRequest): Promise<ITodo | Error> {
  try {
    const todo = new TodoModel(data);
    const savedTodo = await todo.save();
    return savedTodo;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function findByPid(pid: string): Promise<ITodo | null | Error> {
  try {
    const todo = await TodoModel.findOne({ pid }).exec();
    return todo;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function findByUserPid(userPid: string): Promise<ITodo[] | Error> {
  try {
    const todos = await TodoModel.find({ userPid }).exec();
    return todos;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function findAll(): Promise<ITodo[] | Error> {
  try {
    const todos = await TodoModel.find().exec();
    return todos;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function update(pid: string, data: Partial<CreateTodoRequest>): Promise<ITodo | null | Error> {
  try {
    const todo = await TodoModel.findOneAndUpdate({ pid }, data, { new: true }).exec();
    return todo;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function deleteByPid(pid: string): Promise<boolean | Error> {
  try {
    const result = await TodoModel.deleteOne({ pid }).exec();
    return result.deletedCount > 0;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function toggleCompletion(pid: string): Promise<ITodo | null | Error> {
  try {
    const todo = await TodoModel.findOne({ pid }).exec();
    if (!todo) {
      return null;
    }
    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    return updatedTodo;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export const TodoRepository = {
  create,
  findByPid,
  findByUserPid,
  findAll,
  update,
  deleteByPid,
  toggleCompletion,
};