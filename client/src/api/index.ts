import { type Todo } from "../types";

export const api = {
  async getTodos(): Promise<Todo[]> {
    const response = await fetch("http://localhost:5000/todos");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json() as Promise<Todo[]>;
  },
  async addTodo(title: Todo["title"]): Promise<Todo> {
    const response = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<Todo>;
  },
  async deleteTodo(id: Todo["id"]): Promise<void> {
    const response = await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  },
  async updateTodo(todo: Todo): Promise<void> {
    const response = await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  },
};
