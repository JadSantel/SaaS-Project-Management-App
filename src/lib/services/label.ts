import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
import type { CreateLabelInput } from "@/lib/validations/label";

export async function createLabel(workspaceId: string, input: CreateLabelInput) {
  return prisma.label.create({
    data: { workspaceId, name: input.name, color: input.color },
  });  
}

export async function listLabelsForWorkspace(workspaceId: string) {
    return prisma.label.findMany({
        where: { workspaceId },
        orderBy: { name: "asc" },
    });
}

export async function getLabelById(labelId: string) {
    return prisma.label.findUnique({ where: { id: labelId } });
}

export async function deleteLabel(labelId: string) {
    return prisma.label.delete({ where: { id: labelId } });
}

export async function setTaskLabels(
    worksapceId: string,
    taskId: string,
    labelIds: string[]
) {
    if (labelIds.length > 0) {
        const validCount = await prisma.label.count({
            where: { id: { in: labelIds }, workspaceId },
        });
        if (validCount !== labelIds.length) {
            throw new ValidationError(
                "One or more labels do not belong to this workspace"
            );
        }
    }

    await prisma.$transaction([
        prisma.taskLabel.deleteMany({ where: { taskId } }),
        ...(labelIds.length > 0
            ? [
                prisma.taskLabel.createMany({
                    data: labelIds.map((labelId) => ({ taskId, labelId })),
                }),
            ]
            : []),
    ]);
}