
import { useEffect, useState } from "react";
import { fetchTasks } from "../api/taskApi";
import type { Task } from "../types/task";

interface TaskListProps {
  projectId: number;
  token: string;
}

function TaskList({ projectId, token }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchTasks(projectId, token);

        console.log("Tasks received:", data);
        setTasks(data);
      } catch (err) {
        console.error("API ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [projectId, token]);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Unable to load tasks</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project {projectId} Tasks</h1>

      {tasks.length === 0 ? (
        <p>No tasks found for this project.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <h3>{task.title}</h3>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;
