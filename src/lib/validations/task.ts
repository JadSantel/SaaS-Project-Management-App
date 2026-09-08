import { z } from "zod";

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const taskStatusSchema = z.enum([
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "COMPLETED",
]);

export const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters")
        .max(200, "Title must be 200 characters or fewer"),
    description: z.preprocess(
        emptyToUndefined,
        z
        .string()
        .trim()
        .max(2000, "Description must be 2000 characters or fewer")
        .optional()
    ),
    priority: z.preprocess(emptyToUndefined, taskPrioritySchema.default("MEDIUM")),
    dueDate: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
    assigneeId: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type CreateTaskINput = z.infer<typeof createTaskSchema>;