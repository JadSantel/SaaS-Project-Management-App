"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createWorkspaceSchema, updateWorkspaceSchema } from "@/lib/validations/workspace";
import {
  createWorkspace,
  requireWorkspaceAccess,
  updateWorkspaceName,
  deleteWorkspace as deleteWorkspaceRecord,
} from "@/lib/services/workspace";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

export type WorkspaceFormState = {
    error?: string;
};

export async function createWorkspaceAction(
    _prevState: WorkspaceFormState,
    formData: FormData,
): Promise<WorkspaceFormState> {
    const session = await auth();
    if (!session?.user) {
        return { error: "You must be signed in."};
    }

    const parsed = createWorkspaceSchema.safeParse({
        name: formData.get("name"),
    });
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    let workspace;
    try {
        workspace = await createWorkspace(session.user.id, parsed.data);
    } catch (error) {
        console.error("Failed to create workspace", error);
        return { error: "Something went wrong. Please try again."};
    }

    redirect(`/workspaces/${workspace.slug}`);
}

export async function updateWorkspaceAction(
    slug: string,
    _prevState: WorkspaceFormState,
    formData: FormData
): Promise<WorkspaceFormState> {
    const session = await auth();
    if (!session?.user) {
        return { error: "You must be signed in." };
    }

    const parsed = updateWorkspaceSchema.safeParse({
        name: formData.get("name"),
    });
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    try {
        const { workspace } = await requireWorkspaceAccess(
            session.user.id,
            slug,
            "ADMIN"
        );

        await updateWorkspaceName(workspace.id, parsed.data.name);
    } catch (error) {
        if (error instanceof NotFoundError) {
        return { error: "Workspace not found." };
        }
        if (error instanceof ForbiddenError) {
        return { error: error.message };
        }
        console.error("Failed to update workspace", error);
        return { error: "Something went wrong. Please try again." };
    }

    revalidatePath(`/workspaces/${slug}`);
    return {};
}

export async function deleteWorkspaceAction(
    slug: string,
    _prevState: WorkspaceFormState,
    _formData: FormData
): Promise<WorkspaceFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in." };
  }

  try {
    const { workspace } = await requireWorkspaceAccess(
      session.user.id,
      slug,
      "OWNER"
    );
    await deleteWorkspaceRecord(workspace.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { error: "Workspace not found." };
    }
    if (error instanceof ForbiddenError) {
      return { error: error.message };
    }
    console.error("Failed to delete workspace", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/workspaces");
}