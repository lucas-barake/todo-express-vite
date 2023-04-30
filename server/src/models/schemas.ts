import { z } from "zod";

export const todoSchema = z.object({
  id: z
    .number({
      coerce: true,
    })
    .int()
    .positive(),
  title: z.string().trim(),
  completed: z.boolean(),
});
export type Todo = z.infer<typeof todoSchema>;
