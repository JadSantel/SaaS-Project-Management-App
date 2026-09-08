"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createTaskSchema,
  taskStatusSchema,
} from "@/lib/validations/task";
import {
  createTask,
  updateTaskStatus,
  deleteTask as deleteTaskRecord,
} from "@/lib/services/task";
import { requireProjectAccess } from "@/lib/services/project";
import { requireTaskAccess } from "@/lib/services/task";
import { NotFoundError, ForbiddenError, ValidationError } from "@/lib/errors";

export type TaskFormState = {
  error?: string;
};

export async function createTaskAction(
  workspaceSlug: string,
  projectId: string,
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in." };
  }

  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    assigneeId: formData.get("assigneeId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const { workspace, project } = await requireProjectAccess(
      session.user.id,
      workspaceSlug,
      projectId,
      "MEMBER"
    );
    await createTask(workspace.id, project.id, parsed.data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { error: "Project not found." };
    }
    if (error instanceof ForbiddenError) {
      return { error: error.message };
    }
    if (error instanceof ValidationError) {
      return { error: error.message };
    }
    console.error("Failed to create task", error);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/workspaces/${workspaceSlug}/projects/${projectId}`);
  return {};
}

export async function updateTaskStatusAction(
  workspaceSlug: string,
  projectId: string,
  taskId: string,
  status: string
): Promise<TaskFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in." };
  }

  const parsedStatus = taskStatusSchema.safeParse(status);
  if (!parsedStatus.success) {
    return { error: "Invalid status." };
  }

  try {
    const { task } = await requireTaskAccess(
      session.user.id,
      workspaceSlug,
      projectId,
      taskId,
      "MEMBER"
    );
    await updateTaskStatus(task.id, parsedStatus.data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { error: "Task not found." };
    }
    if (error instanceof ForbiddenError) {
      return { error: error.message };
    }
    console.error("Failed to update task status", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/workspaces/${workspaceSlug}/projects/${projectId}`);
  return {};
}

export async function deleteTaskAction(
  workspaceSlug: string,
  projectId: string,
  taskId: string
): Promise<TaskFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in." };
  }

  try {
    const { task } = await requireTaskAccess(
      session.user.id,
      workspaceSlug,
      projectId,
      taskId,
      "ADMIN"
    );
    await deleteTaskRecord(task.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { error: "Task not found." };
    }
    if (error instanceof ForbiddenError) {
      return { error: error.message };
    }
    console.error("Failed to delete task", error);
    return { error: "Something went wrong." };
  }

  revalidatePath(`/workspaces/${workspaceSlug}/projects/${projectId}`);
  return {};
}
