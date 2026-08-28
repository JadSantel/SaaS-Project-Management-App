    import { z } from "zod";

    export const createWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(60, "Name must be 60 characters or fewer"),
    }); 

    export const updateWorkspaceSchema = createWorkspaceSchema;

    export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;