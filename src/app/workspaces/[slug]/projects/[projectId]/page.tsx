import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { requireProjectAccess } from "@/lib/services/project";
import { listTasksForProject } from "@/lib/services/task";
import { listWorkspaceMembers } from "@/lib/services/workspace";
import { hasMinimumRole } from "@/lib/permissions";
import { NotFoundError } from "@/lib/errors";
import { CreateTaskForm } from "./create-task-form";
import { TaskRow } from "./task-row";
import { ProjectSettingsForm } from "./project-settings-form";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; projectId: string }>;
}) {
  const { slug, projectId } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  let workspace, membership, project;
  try {
    ({ workspace, membership, project } = await requireProjectAccess(
      session.user.id,
      slug,
      projectId
    ));
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const canManageProject = hasMinimumRole(membership.role, "ADMIN");
  const canDeleteTasks = hasMinimumRole(membership.role, "ADMIN");

  const [tasks, members] = await Promise.all([
    listTasksForProject(project.id),
    listWorkspaceMembers(workspace.id),
  ]);

  return (
    <main className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <p className="text-xs text-neutral-400">{workspace.name}</p>
          <h1 className="text-xl font-semibold text-neutral-900">
            {project.name}
          </h1>
          {project.description && (
            <p className="mt-1 text-sm text-neutral-500">
              {project.description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-neutral-900">Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-sm text-neutral-500">No tasks yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  workspaceSlug={workspace.slug}
                  projectId={project.id}
                  canDelete={canDeleteTasks}
                  task={{
                    id: task.id,
                    title: task.title,
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate
                      ? task.dueDate.toISOString().slice(0, 10)
                      : null,
                    assignee: task.assignee,
                  }}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-neutral-900">
            Add a task
          </h2>
          <CreateTaskForm
            workspaceSlug={workspace.slug}
            projectId={project.id}
            members={members}
          />
        </div>

        {canManageProject && (
          <div className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-medium text-neutral-900">
              Project settings
            </h2>
            <ProjectSettingsForm
              workspaceSlug={workspace.slug}
              projectId={project.id}
              currentName={project.name}
              currentDescription={project.description}
            />
          </div>
        )}
      </div>
    </main>
  );
}
