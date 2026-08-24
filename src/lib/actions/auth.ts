"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export type LoginState = {
  error?: string;
};


export async function loginAction(
    _prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message}
    }

    try {
        await signIn("credentials", {
            email: parsed.data.email,
            password: parsed.data.password,
            redirectTo: "/dashboard",
        });
        return {};
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Invalid email or password" };
        }
        throw error;
    }
}

export type RegisterState = {
    error?: string;
};

const BCRYPT_COST_FACTOR = 12;

export async function registerAction(
    _prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    const parsed = registerSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { name, email, password } = parsed.data;
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST_FACTOR);

    try {
        await prisma.user.create({
            data: { name, email, passwordHash },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return { error: "An account with that email already exists" };
        }
        throw error;
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
        return {};
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Account created. Please sign in."};
        }
        throw error;
    }
}

