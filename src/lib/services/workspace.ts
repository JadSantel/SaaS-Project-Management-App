import type { WorkspaceRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateWorkspaceSlug } from "@/lib/slug";
import { hasMinimumRole } from "@/lib/permissions";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import type { CreateWorkspaceInput } from "@/lib/validations/workspace";

export async function createWorkspace(
    userId: string,
    input: CreateWorkspaceInput
) {
    const slug = generateWorkspaceSlug(input.name);

    return prisma.$transaction(async (tx) => {
        const workspace = tx.workspace.create({
            data: { name: input.name, slug },
        });
        await tx.workspaceMember.create({
            data: { userId, workspaceId: (await workspace).id, role: "OWNER"},
        });
        return workspace;
    });
}

export async function listWorkspacesForUser(userId: string) {
    const memberships = await prisma.workspaceMember.findMany({
        where: { userId },
        include: { workspace: true },
        orderBy: { workspace: { name: "asc"}},
    });

    return memberships.map((m) => ({ ...m.workspace, role: m.role }));
}

export async function getWorkspaceBySlug(slug: string) {
    return prisma.workspace.findUnique({ where: { slug } });
}

export async function getWorkspaceMembership(
    userId: string,
    workspaceId: string
) {
    return prisma.workspaceMember.findUnique({
        where: { userId_workspaceId: { userId, workspaceId } }, 
    });
}

export async function requireWorkspaceAccess(
    userId: string,
    slug: string,
    minimumRole: WorkspaceRole = "MEMBER"
) {
    const workspace = await getWorkspaceBySlug(slug);
    if (!workspace) {
        throw new NotFoundError("Workspace not found");
    }

    const membership = await getWorkspaceMembership(userId, workspace.id);
    if (!membership) {
        throw new NotFoundError("Workspace not found");
    }

    if (!hasMinimumRole(membership.role, minimumRole)) {
        throw new ForbiddenError(
        "You do not have permission to perform this action"
        );
    }

    return { workspace, membership };
}

export async function updateWorkspaceName(workspaceId: string, name: string) {
    return prisma.workspace.update({
        where: { id: workspaceId },
        data: { name },
    });
}

export async function deleteWorkspace(workspaceId: string) {
    return prisma.workspace.delete({ where: { id: workspaceId } });
}