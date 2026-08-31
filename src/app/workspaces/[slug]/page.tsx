import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { requireWorkspaceAccess } from "@/lib/services/workspace";
import { hasMinimumRole } from "@/lib/permissions";
import { NotFoundError } from "@/lib/errors";
import { WorkspaceSettingsForm } from "./workspace-settings-form";

export default async function WorkspacePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    let workspace, membership;
    try {
        ({ workspace, membership } = await requireWorkspaceAccess(
            session.user.id,
            slug
        ));
    } catch (error) {
        if (error instanceof NotFoundError) {
            notFound();
        }
        throw error;
    }

    const canManage = hasMinimumRole(membership.role, "ADMIN");
    const canDelete = hasMinimumRole(membership.role, "OWNER");

     return (
     <main className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            {workspace.name}
          </h1>
          <p className="text-sm text-neutral-500">
            Your role: {membership.role}
          </p>
        </div>

        {canManage && (
          <div className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-medium text-neutral-900">Settings</h2>
            <WorkspaceSettingsForm
              slug={workspace.slug}
              currentName={workspace.name}
              canDelete={canDelete}
            />
          </div>
        )}
      </div>
    </main>
     );
}