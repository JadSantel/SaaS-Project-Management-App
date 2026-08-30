"use client";

import { useActionState } from "react";
import {
  createWorkspaceAction,
  type WorkspaceFormState,
} from "@/lib/actions/workspace";

const initialState: WorkspaceFormState = {};

export function CreateWorkspaceForm() {
    const [state, formAction, isPending] = useActionState(
        createWorkspaceAction,
        initialState
    );

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-neutral-700">
                Workspace name
                </label>
                <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Acme Corp"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
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
                {isPending ? "Creating..." : "Create workspace"}
            </button>
        </form>
    );
}

