"use client";

import { useActionState } from "react";
import {
  updateWorkspaceAction,
  deleteWorkspaceAction,
  type WorkspaceFormState,
} from "@/lib/actions/workspace";

const initialState: WorkspaceFormState = {};

export function WorkspaceSettingsForm({
    slug,
    currentName,
    canDelete,
}: {
    slug: string;
    currentName: string;
    canDelete: boolean;
}) {
    const updateWithSlug = updateWorkspaceAction.bind(null, slug);
    const [updateState, updateFormAction, isUpdating] = useActionState(
        updateWithSlug,
        initialState
    );

    const deleteWithSlug = deleteWorkspaceAction.bind(null, slug);
    const [deleteState, deleteFormAction, isDeleting] = useActionState(
        deleteWithSlug,
        initialState
    );
    return (
        <div className="space-y-6">
            <form action={updateFormAction} className="space-y-3">
                <label htmlFor="name" className="text-sm font-medium text-neutral-700">
                Workspace name
                </label>
                <input
                id="name"
                name="name"
                defaultValue={currentName}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
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

            {canDelete && (
                <form
                action={deleteFormAction}
                className="space-y-2 border-t border-neutral-200 pt-4"
                >
                <p className="text-xs text-neutral-500">
                    Deleting a workspace permanently removes all its projects and
                    tasks.
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
                    {isDeleting ? "Deleting..." : "Delete workspace"}
                </button>
                </form>
            )}
            </div>
    );  
}