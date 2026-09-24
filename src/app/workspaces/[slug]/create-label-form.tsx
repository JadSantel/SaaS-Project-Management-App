"use client";

import { useActionState } from "react";
import { createLabelAction, type LabelFormState } from "@/lib/actions/label";

const initialState: LabelFormState = {};

export function CreateLabelForm({ workspaceSlug }: { workspaceSlug: string }) {
    const createWithSlug = createLabelAction.bind(null, workspaceSlug);
    const [state, formAction, isPending] = useActionState(
        createWithSlug,
        initialState
    );

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex-1 space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-neutral-700">
          Label name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Bug"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="color" className="text-sm font-medium text-neutral-700">
          Color
        </label>
        <input
          id="color"
          name="color"
          type="color"
          defaultValue="#6B7280"
          className="h-[38px] w-14 cursor-pointer rounded-md border border-neutral-300 p-1"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add label"}
      </button>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}