import fs from "fs/promises";
import path from "path";
import { todoSchema, type Todo } from "./schemas";
import loggers from "../loggers";

const dbPath = path.join(__dirname, "data.json");

const db = {
  getTodos: async (): Promise<Todo[]> => {
    const data = await fs.readFile(dbPath, "utf-8");
    const todos: unknown = JSON.parse(data);

    if (!Array.isArray(todos)) {
      loggers.error("getTodos", todos);
      return [];
    }

    const result = todos.filter((t) => todoSchema.safeParse(t).success);
    return result as Todo[];
  },
  writeTodos: async (todos: Todo[]): Promise<void> => {
    const data = JSON.stringify(todos, null, 2);

    try {
      await fs.writeFile(dbPath, data);
    } catch (err) {
      loggers.error("writeTodos", err);
    }
  },
};

export default db;
