import { getNotesByTodoPid } from "../controllers/notes/notes_controller";
import { createNote } from "../controllers/notes/notes_controller";
import { getTodoByPid } from "../controllers/todo/todo_controller";
import { getTodos } from "../controllers/todo/todo_controller";
import { updateTodo } from "../controllers/todo/todo_controller";
import { toggleTodoCompletion } from "../controllers/todo/todo_controller";
import { deleteTodo } from "../controllers/todo/todo_controller";
import { createTodo } from "../controllers/todo/todo_controller";
import { getUserByPid } from "../controllers/users/users_controller";
import { getUsers } from "../controllers/users/users_controller";
import express from "express";

export function mapUrls(app: express.Express) {
	const msV1APIRouter = express.Router();

	app.use("/api/v1", msV1APIRouter);

	msV1APIRouter.get("/users", getUsers);
	msV1APIRouter.get("/users/:pid", getUserByPid);
	//   msV1APIRouter.get('/users/:pid/export', exportUserTodos);
	msV1APIRouter.post("/todos", createTodo);
	msV1APIRouter.get("/todos", getTodos);
	msV1APIRouter.get("/todos/:pid", getTodoByPid);
	msV1APIRouter.patch("/todos/:pid", updateTodo);
	msV1APIRouter.delete("/todos/:pid", deleteTodo);
	msV1APIRouter.patch("/todos/:pid/toggle", toggleTodoCompletion);
	msV1APIRouter.post("/notes", createNote);
	msV1APIRouter.get("/todos/:pid/notes", getNotesByTodoPid);
}
