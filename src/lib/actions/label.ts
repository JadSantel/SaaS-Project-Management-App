"use server"

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createLabelSchema } from "@/lib/validations/label";
import {
  createLabel,
  getLabelById,
  deleteLabel as deleteLabelRecord,
} from "@/lib/services/label";
import { requireWorkspaceAccess } from "@/lib/services/workspace";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

export type LabelFormState = {
    error?: string;
};

export async function createLabelAction(
    workspaceSlug: string,
    _prevState: LabelFormState,
    formData: FormData
): Promise<LabelFormState> {
    const session = await auth();
    if (!session?.user) {
        return { error: "You must be signed in."};
    }

    const color = formData.get("color");
    const parsed = createLabelSchema.safeParse({
        name: formData.get("name"),
        color: color === "" ? undefined : color,
    });
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    try {
        const { workspace } = await requireWorkspaceAccess(
            session.user.id,
            workspaceSlug,
            "ADMIN"
        );
        await createLabel(workspace.id, parsed.data);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return {error: "Workspace not found." };
        }
        if (error instanceof ForbiddenError) {
            return { error: error.message };
        }
        console.error("Failed to create label", error);
        return { error: "Something went wrong."};
    }

    revalidatePath(`/workspaces/${workspaceSlug}`);
    return {};
}

export async function deleteLabelAction(
    workspaceSlug: string,
    labelId: string
): Promise<LabelFormState> {
    const session = await auth();
    if (!session?.user) {
        return { error: "You must be signed in." };
    }

    try {
        const { workspace } = await requireWorkspaceAccess(
            session.user.id,
            workspaceSlug,
            "ADMIN"
        );
        const label = await getLabelById(labelId);
        if (!label || label.workspaceId !== workspace.id) {
            return { error: "Label not found." };
        }
        await deleteLabelRecord(labelId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return { error: "Workspace not found." };
        }
        if (error instanceof ForbiddenError) {
            return { error: error.message };
        }
        console.error("Failed to delete label", error);
        return { error: "Something went wrong." };
    }

    revalidatePath(`/workspaces/${workspaceSlug}`);
    return {};
}