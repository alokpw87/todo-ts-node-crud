import express from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodoById,
  deleteTodoById,
} from "../controllers/todoController";

const router = express.Router();

router.get('/', getAllTodos);
router.get('/:id',getTodoById);
router.post('/',createTodo);
router.put('/:id',updateTodoById);
router.delete('/:id',deleteTodoById);

export default router;