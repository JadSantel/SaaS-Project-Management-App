import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
    <main className="min-h-screen bg-neutral-50 p-8">
        <div className="mx-auto max-w-2xl space-y-4">
            <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
            <p className="text-sm text-neutral-600">
            Signed in as <span className="font-medium">{session.user.email}</span>
            </p>
            <p className="text-xs text-neutral-400">User ID: {session.user.id}</p>

            <form
            action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
            }}
            >
            <button
                type="submit"
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
                Sign out
            </button>
            </form>
        </div>
    </main>
  ); 
}