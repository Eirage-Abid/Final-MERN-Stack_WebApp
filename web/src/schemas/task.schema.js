import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  dueDate: z.string().optional(),
});