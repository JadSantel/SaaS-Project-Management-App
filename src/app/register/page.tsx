import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-neutral-900">
            Create your account
          </h1>
          <p className="text-sm text-neutral-500">
            Start managing your projects in minutes.
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}