import { randomBytes } from "crypto";

export function slugify(input: string): string {
    return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

export function generateWorkspaceSlug(name: string): string {
    const base = slugify(name) || "workspace";
    const suffix = randomBytes(3).toString("hex");
    return `${base}-${suffix}`;
}