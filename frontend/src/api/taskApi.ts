
import type { Task } from "../types/task";

const API_URL = "http://localhost:8080";

export async function fetchTasks(
    projectId: number,
    token: string
): Promise<Task[]> {
    const response = await fetch(
        `${API_URL}/projects/${projectId}/tasks`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch tasks: ${response.status}`
        );
    }

    return (await response.json()) as Task[];
}
