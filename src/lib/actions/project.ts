"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/lib/validations/project";
import {
  createProject,
  updateProject,
  deleteProject as deleteProjectRecord,
} from "@/lib/services/project";
import { requireWorkspaceAccess } from "@/lib/services/workspace";
import { requireProjectAccess } from "@/lib/services/project";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { parse } from "path";
import { workUnitAsyncStorage } from "next/dist/server/app-render/work-unit-async-storage.external";

export type ProjectFormState = {
    error?: string;
};

export async function createProjectAction(
    workspaceSlug: string,
    _prevState: ProjectFormState,
    formData: FormData
): Promise<ProjectFormState> {
    const session = await auth();
    if (!session?.user) {
        return { error: "You must be signed in." };
    }

    const parsed = createProjectSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
    });
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    let project;
    try {
        const { workspace } = await requireWorkspaceAccess(
            session.user.id,
            workspaceSlug,
            "ADMIN"
        );
        project = await createProject(workspace.id, parsed.data);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return { error: "Workspace not found."};
        }
        if (error instanceof ForbiddenError) {
            return { error: "Something went wrong. Please try again."};
        }
        console.error("Failed to create project.", error);
        return { error: "Something went wrong. Please try again."} 
    }

    redirect (`/workspaces/${workspaceSlug}/projects/${project.id}`);
}

export async function updateProjectAction(
    workspaceSlug: string,
    _prevState: ProjectFormState,
    projectId: string,
    formData: FormData
): Promise<ProjectFormState> {
    const session = await auth();
    if (!session?.user) {
        return { error: "You must be signed in."};
    }

    const parsed = updateProjectSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
    });
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    try {
        const { project } = await requireProjectAccess(
            session.user.id,
            workspaceSlug,
            projectId,
            "ADMIN"
        );
        await updateProject(project.id, parsed.data);
    } catch (error) {
    if (error instanceof NotFoundError) {
      return { error: "Project not found." };
    }
    if (error instanceof ForbiddenError) {
      return { error: error.message };
    }
    console.error("Failed to update project", error);
    return { error: "Something went wrong. Please try again." };
    }
    revalidatePath(`/workspaces/${workspaceSlug}/projects/${projectId}`);
    return {};
}

export async function deleteProjectAction(
    workspaceSlug: string,
    projectId: string,
    _prevState: ProjectFormState,
    _formData: FormData
): Promise<ProjectFormState> {
    const session = await auth();
    if (!session?.user) {
        return { error: "You must be signed in." };
    }

    try {
        const { project } = await requireProjectAccess(
        session.user.id,
        workspaceSlug,
        projectId,
        "ADMIN"
        );
        await deleteProjectRecord(project.id);
    } catch (error) {
        if (error instanceof NotFoundError) {
        return { error: "Project not found." };
        }
        if (error instanceof ForbiddenError) {
        return { error: error.message };
        }
        console.error("Failed to delete project", error);
        return { error: "Something went wrong. Please try again." };
    }

    redirect(`/workspaces/${workspaceSlug}`);
}
