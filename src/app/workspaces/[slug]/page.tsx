import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { requireWorkspaceAccess } from "@/lib/services/workspace";
import { listProjectsForWorkspace } from "@/lib/services/project";
import { hasMinimumRole } from "@/lib/permissions";
import { NotFoundError } from "@/lib/errors";
import { WorkspaceSettingsForm } from "./workspace-settings-form";
import { CreateProjectForm } from "./create-project-form";

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

  const projects = await listProjectsForWorkspace(workspace.id);

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

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-neutral-900">Projects</h2>
          {projects.length === 0 ? (
            <p className="text-sm text-neutral-500">No projects yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
              {projects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/workspaces/${workspace.slug}/projects/${project.id}`}
                    className="block px-4 py-3 hover:bg-neutral-50"
                  >
                    <span className="text-sm font-medium text-neutral-900">
                      {project.name}
                    </span>
                    {project.description && (
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {project.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {canManage && (
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-medium text-neutral-900">
              Create a project
            </h2>
            <CreateProjectForm workspaceSlug={workspace.slug} />
          </div>
        )}

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