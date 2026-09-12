"use client";

import { useActionState } from "react";
import { createTaskAction, type TaskFormState } from "@/lib/actions/task";
import { create } from "domain";
import { init } from "next/dist/compiled/webpack/webpack";

const initialState: TaskFormState = {};

type Member = { id: string; name: string | null; email: string };

export function CreateTaskForm({
    workspaceSlug,
    projectId,
    members,
}: {
    workspaceSlug: string;
    projectId: string;
    members: Member[];
}) {
    const createWithIds = createTaskAction.bind(
        null,
        workspaceSlug,
        projectId
    );
    const [state, formAction, isPending] = useActionState(
        createWithIds,
        initialState
    );

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
                <label htmlFor="title" className="text-sm font-medium text-neutral-700">
                Title
                </label>
                <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
            </div>

            <div className="space-y-1.5">
                <label
                htmlFor="description"
                className="text-sm font-medium text-neutral-700"
                >
                Description <span className="text-neutral-400">(optional)</span>
                </label>
                <textarea
                id="description"
                name="description"
                rows={2}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                <label
                    htmlFor="priority"
                    className="text-sm font-medium text-neutral-700"
                >
                    Priority
                </label>
                <select
                    id="priority"
                    name="priority"
                    defaultValue="MEDIUM"
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>
                </div>

                <div className="space-y-1.5">
                <label
                    htmlFor="dueDate"
                    className="text-sm font-medium text-neutral-700"
                >
                    Due date <span className="text-neutral-400">(optional)</span>
                </label>
                <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
                </div>
            </div>

            <div className="space-y-1.5">
                <label
                htmlFor="assigneeId"
                className="text-sm font-medium text-neutral-700"
                >
                Assignee <span className="text-neutral-400">(optional)</span>
                </label>
                <select
                id="assigneeId"
                name="assigneeId"
                defaultValue=""
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                >
                <option value="">Unassigned</option>
                {members.map((member) => (
                    <option key={member.id} value={member.id}>
                    {member.name ?? member.email}
                    </option>
                ))}
                </select>
            </div>

            {state.error && (
                <p role="alert" className="text-sm text-red-600">
                {state.error}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
                {isPending ? "Creating..." : "Create task"}
            </button>
        </form>
    );
};