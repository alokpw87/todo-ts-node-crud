import express from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodoById,
  deleteTodoById,
} from "../controllers/todoController";
import { userRegister, userLogin } from "../controllers/userController";
import { auth } from "../middleware/auth";

const router = express.Router();
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/todos/", auth, getAllTodos);
router.get("/todos/:id", auth, getTodoById);
router.post("/todos/", auth, createTodo);
router.put("/todos/:id", auth, updateTodoById);
router.delete("/todos/:id", auth, deleteTodoById);

export default router;
