"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "@/lib/actions/auth";

const initialState: RegisterState = {};

const inputClasses = "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";
const labelClasses = "text-sm font-medium text-neutral-700";

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(
        registerAction,
        initialState
    );

    return (
        <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
                <label htmlFor="name" className={labelClasses}>
                Name
                </label>
                <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={inputClasses}
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="email" className={labelClasses}>
                Email
                </label>
                <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClasses}
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="password" className={labelClasses}>
                Password
                </label>
                <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className={inputClasses}
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className={labelClasses}>
                Confirm password
                </label>
                <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                className={inputClasses}
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
                {isPending ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-neutral-900 underline">
                Sign in
                </Link>
            </p>
        </form>
    );  
}