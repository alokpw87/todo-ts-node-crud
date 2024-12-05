import { Request, Response } from "express";
import { Todo } from "../models/todo";
import redisClient from "../config/redis";

export const getAllTodos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cachedTodos = await redisClient.get("todos");
    if (cachedTodos) {
      res.status(200).json(JSON.parse(cachedTodos));
      return;
    }

    const todos = await Todo.find();
    if (!todos.length) {
      res.status(404).json({ message: "No todos found in the database!" });
      return;
    }

    await redisClient.set("todos", JSON.stringify(todos), { EX: 60 * 5 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error });
  }
};

export const getTodoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todoId = `todo:${req.params.id}`;
    const cachedTodo = await redisClient.get(todoId);
    if (cachedTodo) {
      res.status(200).json(JSON.parse(cachedTodo));
      return;
    }
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ message: "Todo not found!" });
      return;
    }
    await redisClient.set(todoId, JSON.stringify(todo), { EX: 60 * 5 });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todo", error });
  }
};

export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todo = new Todo(req.body);
    const createdTodo = await todo.save();

    await redisClient.del("todos");
    res.status(201).json(createdTodo);
  } catch (error) {
    res.status(500).json({ message: "Error creating todo", error });
  }
};

export const updateTodoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todoId = `todo:${req.params.id}`;
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!todo) {
      res.status(404).json({ message: "Todo not updated!" });
      return;
    }

    await redisClient.del("todos");
    await redisClient.set(todoId, JSON.stringify(todo), { EX: 60 * 5 });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Error updating todo", error });
  }
};

export const deleteTodoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const todoId = `todo:${req.params.id}`;
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      res.status(404).json({ message: "Todo not deleted!" });
      return;
    }

    await redisClient.del("todos");
    await redisClient.del(todoId);
    res.status(200).json({ message: "Todo deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo", error });
  }
};
