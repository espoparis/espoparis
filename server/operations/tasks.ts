export type OperationalTaskKind =
  | "review-grades"
  | "review-enrollment"
  | "confirm-payment"
  | "approve-promotion"
  | "review-recording"
  | "resolve-data-quality";

export type OperationalTaskStatus = "open" | "in-progress" | "resolved" | "dismissed";

export type OperationalTask = {
  id: string;
  kind: OperationalTaskKind;
  title: string;
  status: OperationalTaskStatus;
  assigneeRole: "teacher" | "editor" | "admin";
  entityId: string;
  createdAt: string;
  resolvedAt?: string | null;
};

export function resolveTask(task: OperationalTask, resolvedAt: string): OperationalTask {
  if (task.status === "resolved") return task;
  return { ...task, status: "resolved", resolvedAt };
}

export function openTasksForRole(tasks: OperationalTask[], role: OperationalTask["assigneeRole"]): OperationalTask[] {
  return tasks.filter((task) => task.assigneeRole === role && task.status !== "resolved" && task.status !== "dismissed");
}
