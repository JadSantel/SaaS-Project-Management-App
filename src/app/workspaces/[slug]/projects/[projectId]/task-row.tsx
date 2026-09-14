"use client";

import { useTransition } from "react";
import {
  updateTaskStatusAction,
  deleteTaskAction,
} from "@/lib/actions/task";

const STATUS_OPTIONS = [
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "COMPLETED",
] as const;

type Task = {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string | null;
    assignee: { name: string | null; email: string } | null;
};

export function TaskRow({ 
    workspaceSlug,
    projectId,
    task,
    canDelete,
}: {
    workspaceSlug: string;
    projectId: string;
    task: Task;
    canDelete: boolean;   
}) {
    const [ isPending, startTransition ] = useTransition();

    function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const status = event.target.value;
        startTransition(async () => {
            await updateTaskStatusAction(workspaceSlug, projectId, task.id, status);
        });
    }

    function handleDelete() {
        startTransition(async () => {
            await deleteTaskAction(workspaceSlug, projectId, task.id);
        });
    }
    return (
        <li className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-900">
                {task.title}
                </p>
                <p className="text-xs text-neutral-500">
                {task.priority} ·{" "}
                {task.assignee
                    ? task.assignee.name ?? task.assignee.email
                    : "Unassigned"}
                {task.dueDate && ` · Due ${task.dueDate}`}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <select
                value={task.status}
                onChange={handleStatusChange}
                disabled={isPending}
                className="rounded-md border border-neutral-300 px-2 py-1 text-xs outline-none focus:border-neutral-900 disabled:opacity-50"
                >
                {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                    {status.replace("_", " ")}
                    </option>
                ))}
                </select>

                {/* Hidden from MEMBER as a UX nicety — deleteTaskAction
                    re-checks the ADMIN requirement server-side regardless. */}
                {canDelete && (
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                    Delete
                </button>
                )}
            </div>
        </li>
    );
}