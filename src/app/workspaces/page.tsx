import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listWorkspacesForUser } from "@/lib/services/workspace";
import { CreateWorkspaceForm } from "./create-workspace-form";

export default async function WorkspacesPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }   
    
    const workspaces = await listWorkspacesForUser(session.user.id);

    return (
        <main className="min-h-screen bg-neutral-50 p-8">
            <div className="mx-auto max-w-2xl space-y-8">
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900">
                        Your workspaces
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Workspaces you belong to.
                    </p>
                </div>

                {workspaces.length === 0 ? (
                    <p className="text-sm text-neutral-500">
                        You don&apos;t belong to any workspaces yet — create one below.
                    </p>
                ) : (
                    <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
                        {workspaces.map((workspace) => (
                        <li key={workspace.id}>
                            <Link
                            href={`/workspaces/${workspace.slug}`}
                            className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50"
                            >
                            <span className="text-sm font-medium text-neutral-900">
                                {workspace.name}
                            </span>
                            <span className="text-xs uppercase tracking-wide text-neutral-400">
                                {workspace.role}
                            </span>
                            </Link>
                        </li>
                        ))}
                    </ul>
                    )}

                <div className="rounded-lg border border-neutral-200 bg-white p-6">
                    <h2 className="mb-4 text-sm font-medium text-neutral-900">
                        Create a workspace
                    </h2>
                    <CreateWorkspaceForm />
                </div>
            </div>
        </main>
    );    
}