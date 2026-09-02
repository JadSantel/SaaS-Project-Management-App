import { z } from "zod";

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const createProjectSchema = z.object({
    name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or fewer"),
    description: z.preprocess(
        emptyToUndefined,
        z
        .string()
        .trim()
        .max(500, "Description must be 500 characters or fewer")
        .optional()
    ),
});

export const updateProjectSchema = createProjectSchema;

export type CreateProjectInput = z.infer<typeof createProjectSchema>;