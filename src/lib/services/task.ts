import type { WorkspaceRole, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireProjectAccess } from "@/lib/services/project";
import { NotFoundError, ValidationError } from "@/lib/errors";
import type { CreateTaskInput } from "@/lib/validations/task";

export async function createTask(
  workspaceId: string,
  projectId: string,
  input: CreateTaskInput
) {
  
  if (input.assigneeId) {
    const assigneeIsMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId: input.assigneeId, workspaceId },
      },
    });
    if (!assigneeIsMember) {
      throw new ValidationError(
        "Assignee must be a member of this workspace"
      );
    }
  }

  return prisma.task.create({
    data: {
      projectId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: input.dueDate,
      assigneeId: input.assigneeId,
    },
  });
}

export async function listTasksForProject(projectId: string) {
  return prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTaskById(taskId: string) {
  return prisma.task.findUnique({ where: { id: taskId } });
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  return prisma.task.update({ where: { id: taskId }, data: { status } });
}

export async function deleteTask(taskId: string) {
  return prisma.task.delete({ where: { id: taskId } });
}

export async function requireTaskAccess(
  userId: string,
  workspaceSlug: string,
  projectId: string,
  taskId: string,
  minimumRole: WorkspaceRole = "MEMBER"
) {
  const { workspace, membership, project } = await requireProjectAccess(
    userId,
    workspaceSlug,
    projectId,
    minimumRole
  );

  const task = await getTaskById(taskId);
  if (!task || task.projectId !== project.id) {
    throw new NotFoundError("Task not found");
  }

  return { workspace, membership, project, task };
}
