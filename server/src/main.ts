import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import db from "./models/db";
import { type Todo, todoSchema } from "./models/schemas";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// GET all
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get("/todos", async (_req: Request, res: Response) => {
  const todos = await db.getTodos();
  res.status(200).json(todos);
});

// POST one
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post("/todos", async (req: Request, res: Response) => {
  const bodyResult = todoSchema.pick({ title: true }).safeParse(req.body);
  if (!bodyResult.success) {
    res.status(400).send("Invalid request");
    return;
  }

  const todos = await db.getTodos();
  const newTodo: Todo = {
    title: bodyResult.data.title,
    id: todos.length + 1,
    completed: false,
  };
  todos.push(newTodo);
  void db.writeTodos(todos);
  res.status(201).json(newTodo);
});

// UPDATE one
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.put("/todos/:id", async (req: Request, res: Response) => {
  const idResult = todoSchema.shape.id.safeParse(req.params.id);
  if (!idResult.success) {
    res.status(400).send(idResult.error.errors);
    return;
  }

  const id = idResult.data;

  const bodyResult = todoSchema.omit({ id: true }).safeParse(req.body);
  if (!bodyResult.success) {
    res.status(400).send("Invalid request");
    return;
  }

  const updatedTodo: Todo = { ...bodyResult.data, id };
  const todos = await db.getTodos();

  const exists = todos.some((t) => t.id === id);
  if (!exists) {
    res.status(404).send("Todo not found");
    return;
  }

  const newTodos = todos.map((t) => (t.id === id ? updatedTodo : t));
  void db.writeTodos(newTodos);
  res.status(200).json(updatedTodo);
});

// DELETE one
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.delete("/todos/:id", async (req: Request, res: Response) => {
  const idResult = todoSchema.shape.id.safeParse(req.params.id);
  if (!idResult.success) {
    res.status(400).send("Invalid ID");
    return;
  }
  console.log(idResult);

  const todos = await db.getTodos();
  const newTodos = todos.filter((t) => t.id !== idResult.data);

  if (newTodos.length < todos.length) {
    void db.writeTodos(newTodos);
    res.status(200).send("Todo deleted");
  } else {
    res.status(404).send("Todo not found");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
