import { LoginForm } from "./login-form";

export default function LoginPage() {
    return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-sm space-y-6 rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="space-y-1">
            <h1 className="text-xl font-semibold text-neutral-900">Sign in</h1>
            <p className="text-sm text-neutral-500">
                Welcome back. Enter your details to continue.
            </p>
            </div>
            <LoginForm />
        </div>
    </main>      
    );
}