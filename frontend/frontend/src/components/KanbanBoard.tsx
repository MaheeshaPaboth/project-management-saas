
import { useEffect, useState } from "react";

type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "REVIEW"
    | "DONE";

type TaskPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

interface Task {
    id: number;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
}

interface KanbanBoardProps {
    projectId: number;
}

const API_URL = "http://localhost:8080";

export default function KanbanBoard({
    projectId,
}: KanbanBoardProps) {
    // Tasks backend එකෙන් ලබාගෙන state එකේ තබාගැනීම
    const [tasks, setTasks] = useState<Task[]>([]);

    // Search සහ Priority Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] =
        useState<TaskPriority | "ALL">("ALL");

    // Loading සහ Error states
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Update වන task එක හඳුනාගැනීම
    const [updatingTaskId, setUpdatingTaskId] =
        useState<number | null>(null);

    // Backend එකෙන් tasks ලබාගැනීම
    useEffect(() => {
        async function loadTasks() {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("jwt_token");

            if (!token) {
                setError("Please login first.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/projects/${projectId}/tasks`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to load tasks (${response.status})`
                    );
                }

                const data: Task[] = await response.json();

                setTasks(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load tasks."
                );
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, [projectId]);

    // Search සහ Priority අනුව tasks filter කිරීම
    const displayTasks = tasks.filter((task) => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim());

        const matchesPriority =
            priorityFilter === "ALL" ||
            task.priority === priorityFilter;

        return matchesSearch && matchesPriority;
    });

    // Task එකක status එක වෙනස් කිරීම
    async function handleStatusChange(
        taskId: number,
        newStatus: TaskStatus
    ) {
        const token = localStorage.getItem("jwt_token");

        if (!token) {
            setError("Please login first.");
            return;
        }

        setError("");
        setUpdatingTaskId(taskId);

        try {
            const response = await fetch(
                `${API_URL}/tasks/${taskId}/status?status=${newStatus}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Status update failed (${response.status})`
                );
            }

            // Backend update සාර්ථක වූ පසු local state එක update කිරීම
            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === taskId
                        ? { ...task, status: newStatus }
                        : task
                )
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update task."
            );
        } finally {
            setUpdatingTaskId(null);
        }
    }

    // Kanban column එකක් render කිරීම
    function renderColumn(
        status: TaskStatus,
        title: string,
        bgColor: string
    ) {
        // වැදගත්: tasks වෙනුවට displayTasks භාවිතා කරන්න
        const columnTasks = displayTasks.filter(
            (task) => task.status === status
        );

        return (
            <div
                key={status}
                style={{
                    background: bgColor,
                    padding: "15px",
                    borderRadius: "8px",
                    minWidth: "230px",
                    flex: "1",
                    minHeight: "200px",
                }}
            >
                <h3>
                    {title} ({columnTasks.length})
                </h3>

                {columnTasks.length === 0 && (
                    <p style={{ color: "#666", fontSize: "14px" }}>
                        No tasks found.
                    </p>
                )}

                {columnTasks.map((task) => (
                    <div
                        key={task.id}
                        style={{
                            background: "white",
                            color: "#222",
                            padding: "12px",
                            margin: "10px 0",
                            borderRadius: "6px",
                            boxShadow: "0 2px 4px #00000015",
                        }}
                    >
                        <strong>{task.title}</strong>

                        <p
                            style={{
                                fontSize: "13px",
                                color: "#555",
                                margin: "8px 0",
                            }}
                        >
                            Priority: {task.priority}
                        </p>

                        <select
                            value={task.status}
                            disabled={updatingTaskId === task.id}
                            onChange={(event) =>
                                handleStatusChange(
                                    task.id,
                                    event.target.value as TaskStatus
                                )
                            }
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginTop: "10px",
                            }}
                        >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">
                                In Progress
                            </option>
                            <option value="REVIEW">Review</option>
                            <option value="DONE">Done</option>
                        </select>

                        {updatingTaskId === task.id && (
                            <small>Updating...</small>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Project Board</h2>

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            {/* Search සහ Priority Filter */}
            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                }}
            >
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(event) =>
                        setSearchQuery(event.target.value)
                    }
                    style={{
                        padding: "8px",
                        width: "250px",
                        maxWidth: "100%",
                    }}
                />

                <select
                    value={priorityFilter}
                    onChange={(event) =>
                        setPriorityFilter(
                            event.target.value as TaskPriority | "ALL"
                        )
                    }
                    style={{ padding: "8px" }}
                >
                    <option value="ALL">All Priorities</option>
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>

                <button
                    type="button"
                    onClick={() => {
                        setSearchQuery("");
                        setPriorityFilter("ALL");
                    }}
                    style={{
                        padding: "8px 14px",
                        cursor: "pointer",
                    }}
                >
                    Clear Filters
                </button>
            </div>

            <p style={{ marginBottom: "15px" }}>
                Showing {displayTasks.length} of {tasks.length} tasks
            </p>

            {/* Kanban Board */}
            <div
                style={{
                    display: "flex",
                    gap: "16px",
                    overflowX: "auto",
                    alignItems: "stretch",
                    paddingBottom: "10px",
                }}
            >
                {renderColumn(
                    "TODO",
                    "📌 To Do",
                    "#ffebee"
                )}

                {renderColumn(
                    "IN_PROGRESS",
                    "⏳ In Progress",
                    "#fff3e0"
                )}

                {renderColumn(
                    "REVIEW",
                    "👀 Review",
                    "#e3f2fd"
                )}

                {renderColumn(
                    "DONE",
                    "✅ Done",
                    "#e8f5e9"
                )}
            </div>
        </div>
    );
}
