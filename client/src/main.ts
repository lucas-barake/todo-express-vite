import { api } from "./api";
import "./style.css";
import { type Todo, todoSchema } from "./types";

function getElement<T extends HTMLElement>(query: string): T {
  const el = document.querySelector<T>(query);

  if (el === null) {
    throw new Error(`El elemento con el query - ${query} - no existe`);
  }

  return el;
}

const app = getElement<HTMLDivElement>("#app");

const todos: Todo[] = [];

function renderTodos(): void {
  app.innerHTML = "";

  const ul = document.createElement("ul");
  app.appendChild(ul);

  todos.forEach((todo) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    checkbox.onchange = async () => {
      todo.completed = checkbox.checked;
      await api.updateTodo(todo);
      renderTodos();
    };

    const input = document.createElement("input");
    input.type = "text";
    input.value = todo.title;

    input.onblur = async (e) => {
      const { value } = e.target as HTMLInputElement;
      const result = todoSchema
        .pick({ title: true })
        .safeParse({ title: value });
      if (result.success) {
        todo.title = result.data.title;
        await api.updateTodo(todo);
        renderTodos();
      }
    };

    const button = document.createElement("button");
    button.innerText = "Delete";
    button.onclick = async () => {
      await api.deleteTodo(todo.id);
      const index = todos.indexOf(todo);
      todos.splice(index, 1);
      renderTodos();
    };

    li.appendChild(checkbox);
    li.appendChild(input);
    li.appendChild(button);

    ul.appendChild(li);
  });
}

const form = getElement<HTMLFormElement>("form");
form.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const title = formData.get("title");

  const result = todoSchema.pick({ title: true }).safeParse({ title });
  if (result.success) {
    const newTodo = await api.addTodo(result.data.title);
    todos.push(newTodo);
    renderTodos();
  }
};

async function main(): Promise<void> {
  const fetchedTodos = await api.getTodos();
  todos.push(...fetchedTodos);
  renderTodos();
}

void main();
