import { RequestHandler } from 'express';
import { validateDataUsingJOI } from '../../utils/validator';
import { ReturnError, ReturnSuccess } from '../../models/request_response';
import { CreateTodoRequest } from '../../entities/todo';
import { CreateTodoRequestSchema } from '../../entities/todo';
import { TodoService } from '../../services/todos/todos_serv';
import { UpdateTodoRequest } from '../../entities/todo';
import { UpdateTodoRequestSchema } from '../../entities/todo';


export const createTodo: RequestHandler = async (req, res) => {
  const data = validateDataUsingJOI<CreateTodoRequest>(req.body, CreateTodoRequestSchema);
  if (data instanceof Error) {
    return ReturnError(res, [data.message], 400);
  }

  const result = await TodoService.createTodo(data);
  if (result instanceof Error) {
    return ReturnError(res, [result.message], 400);
  }

  return ReturnSuccess(res, result);
};

export const getTodos: RequestHandler = async (req, res) => {
  const userPid = req.query.userPid as string | undefined;

  const todos = await TodoService.getTodos(userPid);
  if (todos instanceof Error) {
    return ReturnError(res, [todos.message], 400);
  }

  return ReturnSuccess(res, todos);
};

export const getTodoByPid: RequestHandler = async (req, res) => {
  const { pid } = req.params;

  const todo = await TodoService.getTodoByPid(pid);
  if (todo instanceof Error) {
    return ReturnError(res, [todo.message], 404);
  }

  return ReturnSuccess(res, todo);
};

export const updateTodo: RequestHandler = async (req, res) => {
  const { pid } = req.params;
  const data = validateDataUsingJOI<UpdateTodoRequest>(req.body, UpdateTodoRequestSchema);
  if (data instanceof Error) {
    return ReturnError(res, [data.message], 400);
  }

  const updatedTodo = await TodoService.updateTodo(pid, data);
  if (updatedTodo instanceof Error) {
    return ReturnError(res, [updatedTodo.message], 400);
  }

  return ReturnSuccess(res, updatedTodo);
};

export const deleteTodo: RequestHandler = async (req, res) => {
  const { pid } = req.params;

  const result = await TodoService.deleteTodo(pid);
  if (result instanceof Error) {
    return ReturnError(res, [result.message], 404);
  }

  return res.status(200).json({ message: "Successfully deleted" });
};

export const toggleTodoCompletion: RequestHandler = async (req, res) => {
  const { pid } = req.params;

  const updatedTodo = await TodoService.toggleTodoCompletion(pid);
  if (updatedTodo instanceof Error) {
    return ReturnError(res, [updatedTodo.message], 404);
  }

  return ReturnSuccess(res, updatedTodo);
};