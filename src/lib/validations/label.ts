import { z } from "zod";

export const createLabelSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1,"Name is required")
        .max(30,"Name must be 30 characters or fewer"),
    color: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex value like #6B7280")
        .default("#6B7280"),
});

export type CreateLabelInput = z.infer<typeof createLabelSchema>;