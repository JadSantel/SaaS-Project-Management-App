"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(
        loginAction,
        initialState
    );

    return (
        <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
                <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-700"
                >
                Email
                </label>
                <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
            </div>

            <div className="space-y-1.5">
                <label
                htmlFor="password"
                className="text-sm font-medium text-neutral-700"
                >
                Password
                </label>
                <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
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
                className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
                {isPending ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-sm text-neutral-500">
                No account?{" "}
                <Link href="/register" className="font-medium text-neutral-900 underline">
                Register
                </Link>
            </p>
        </form>     
    );
}