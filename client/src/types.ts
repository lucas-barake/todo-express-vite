import { z } from "zod";

const todoSchema = z.object({
  id: z
    .number({
      coerce: true,
    })
    .positive()
    .int(),
  title: z.string().trim().min(1),
  completed: z.boolean(),
});
type Todo = z.infer<typeof todoSchema>;

export { todoSchema, type Todo };
