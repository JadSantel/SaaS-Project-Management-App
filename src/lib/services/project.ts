import type { WorkspaceRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/lib/services/workspace";
import { NotFoundError } from "@/lib/errors";
import type { CreateProjectInput } from "@/lib/validations/project";

export async function createProject(
    workspaceId: string,
    input: CreateProjectInput
) {
    return prisma.project.create({
        data: {
            workspaceId,
            name: input.name,
            description: input.description,
        },
    });
}

export async function listProjectsForWorkspace(workspaceId: string) {
    return prisma.project.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "asc" },
    });
}

export async function getProjectById(projectId: string) {
    return prisma.project.findUnique({ where: { id: projectId } });
}

export async function updateProject(
    projectId: string,
    input: CreateProjectInput
) {
    return prisma.project.update({
        where: { id: projectId },
        data: { name: input.name, description: input.description }
    });
}

export async function deleteProject(projectId: string) {
    return prisma.project.delete({ where: { id: projectId } });
}

export async function requireProjectAccess(
    userId: string,
    workspaceSlug: string,
    projectId: string,
    minimumRole: WorkspaceRole = "MEMBER"
) {
    const { workspace, membership } = await requireWorkspaceAccess(
        userId,
        workspaceSlug,
        minimumRole
    );

    const project = await getProjectById(projectId);
    if (!project || project.workspaceId !== workspace.id) {
        throw new NotFoundError("Project not found");
    }

    return { workspace, membership, project };
}