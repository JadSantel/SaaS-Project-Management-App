"use client";

import { useActionState } from "react";
import {
  updateProjectAction,
  deleteProjectAction,
  type ProjectFormState,
} from "@/lib/actions/project";

const initialState: ProjectFormState = {};

export function ProjectSettingsForm({
    workspaceSlug,
    projectId,
    currentName,
    currentDescription,
}: {
    workspaceSlug: string;
    projectId: string;
    currentName: string;
    currentDescription: string | null;
}) {
    const updateWithIds = updateProjectAction.bind(
        null,
        workspaceSlug,
        projectId
    );
    
    const [updateState, updateFormAction, isUpdating] = useActionState(
        updateWithIds,
        initialState
    );

    const deleteWithIds = deleteProjectAction.bind(
        null,
        workspaceSlug,
        projectId
    );
    
    const [deleteState, deleteFormAction, isDeleting] = useActionState(
        deleteWithIds,
        initialState
    );

    return (
        <div className="space-y-6">
            <form action={updateFormAction} className="space-y-3">
                <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-neutral-700">
                    Project name
                </label>
                <input
                    id="name"
                    name="name"
                    defaultValue={currentName}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
                </div>
                <div className="space-y-1.5">
                <label
                    htmlFor="description"
                    className="text-sm font-medium text-neutral-700"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={2}
                    defaultValue={currentDescription ?? ""}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
                </div>
                {updateState.error && (
                <p role="alert" className="text-sm text-red-600">
                    {updateState.error}
                </p>
                )}
                <button
                type="submit"
                disabled={isUpdating}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
                >
                {isUpdating ? "Saving..." : "Save changes"}
                </button>
            </form>

            <form
                action={deleteFormAction}
                className="space-y-2 border-t border-neutral-200 pt-4"
            >
                <p className="text-xs text-neutral-500">
                Deleting a project permanently removes all its tasks.
                </p>
                {deleteState.error && (
                <p role="alert" className="text-sm text-red-600">
                    {deleteState.error}
                </p>
                )}
                <button
                type="submit"
                disabled={isDeleting}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                {isDeleting ? "Deleting..." : "Delete project"}
                </button>
            </form>
        </div>       
    );
}