export type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "REVIEW"
    | "DONE";

export type TaskPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

export interface Task {
    id: number;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: number;
    assigneeId?: number;
    description?: string;
}
