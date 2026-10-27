
import { useEffect, useState } from "react";
import API_URL from "../config";

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

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "ALL">("ALL");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

    // Add-task form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newPriority, setNewPriority] = useState<TaskPriority>("MEDIUM");
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState("");

    function getToken() {
        return localStorage.getItem("jwt_token") ?? "";
    }

    async function loadTasks() {
        setLoading(true);
        setError("");
        const token = getToken();
        if (!token) { setError("Please login first."); setLoading(false); return; }

        try {
            const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(`Failed to load tasks (${response.status})`);
            setTasks(await response.json());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load tasks.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadTasks(); }, [projectId]);

    const displayTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    async function handleStatusChange(taskId: number, newStatus: TaskStatus) {
        const token = getToken();
        if (!token) { setError("Please login first."); return; }
        setError("");
        setUpdatingTaskId(taskId);
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}/status?status=${newStatus}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(`Status update failed (${response.status})`);
            setTasks((cur) => cur.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update task.");
        } finally {
            setUpdatingTaskId(null);
        }
    }

    async function handleAddTask(e: React.FormEvent) {
        e.preventDefault();
        if (!newTitle.trim()) return;
        const token = getToken();
        if (!token) { setAddError("Please login first."); return; }
        setAdding(true);
        setAddError("");
        try {
            const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: newTitle.trim(), priority: newPriority }),
            });
            if (!response.ok) throw new Error(`Failed to create task (${response.status})`);
            setNewTitle("");
            setNewPriority("MEDIUM");
            setShowAddForm(false);
            await loadTasks();
        } catch (err) {
            setAddError(err instanceof Error ? err.message : "Could not create task.");
        } finally {
            setAdding(false);
        }
    }

    function renderColumn(status: TaskStatus, title: string, bgColor: string) {
        const columnTasks = displayTasks.filter((task) => task.status === status);
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
                <h3>{title} ({columnTasks.length})</h3>
                {columnTasks.length === 0 && (
                    <p style={{ color: "#666", fontSize: "14px" }}>No tasks found.</p>
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
                        <p style={{ fontSize: "13px", color: "#555", margin: "8px 0" }}>
                            Priority: {task.priority}
                        </p>
                        <select
                            value={task.status}
                            disabled={updatingTaskId === task.id}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                            style={{ display: "block", width: "100%", padding: "8px", marginTop: "10px" }}
                        >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="REVIEW">Review</option>
                            <option value="DONE">Done</option>
                        </select>
                        {updatingTaskId === task.id && <small>Updating...</small>}
                    </div>
                ))}
            </div>
        );
    }

    if (loading) return <p>Loading tasks...</p>;

    return (
        <div style={{ padding: "20px" }}>
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ margin: 0 }}>Project Board</h2>
                <button
                    id="btn-add-task"
                    onClick={() => { setShowAddForm((v) => !v); setAddError(""); }}
                    style={{
                        background: "#059669",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "14px",
                    }}
                >
                    {showAddForm ? "✕ Cancel" : "+ Add Task"}
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Add Task Form */}
            {showAddForm && (
                <form
                    onSubmit={handleAddTask}
                    style={{
                        border: "1px solid #059669",
                        borderRadius: "10px",
                        padding: "18px",
                        marginBottom: "20px",
                        background: "#064e3b",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-end",
                        flexWrap: "wrap",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1", minWidth: "180px" }}>
                        <label style={{ color: "#6ee7b7", fontSize: "13px", fontWeight: 600 }}>Task Title *</label>
                        <input
                            id="input-task-title"
                            type="text"
                            placeholder="e.g. Fix login bug"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                            style={{
                                padding: "9px 12px",
                                borderRadius: "6px",
                                border: "1px solid #10b981",
                                background: "#065f46",
                                color: "#fff",
                                fontSize: "14px",
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ color: "#6ee7b7", fontSize: "13px", fontWeight: 600 }}>Priority</label>
                        <select
                            id="select-task-priority"
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                            style={{
                                padding: "9px 12px",
                                borderRadius: "6px",
                                border: "1px solid #10b981",
                                background: "#065f46",
                                color: "#fff",
                                fontSize: "14px",
                                cursor: "pointer",
                            }}
                        >
                            <option value="LOW">🟢 Low</option>
                            <option value="MEDIUM">🟡 Medium</option>
                            <option value="HIGH">🟠 High</option>
                            <option value="URGENT">🔴 Urgent</option>
                        </select>
                    </div>

                    <button
                        id="btn-submit-task"
                        type="submit"
                        disabled={adding}
                        style={{
                            background: adding ? "#10b981" : "#059669",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "9px 18px",
                            cursor: adding ? "not-allowed" : "pointer",
                            fontWeight: 700,
                            fontSize: "14px",
                        }}
                    >
                        {adding ? "Adding…" : "✓ Add"}
                    </button>

                    {addError && (
                        <p style={{ color: "#fca5a5", margin: 0, width: "100%" }}>⚠ {addError}</p>
                    )}
                </form>
            )}

            {/* Search & Filter */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: "8px", width: "250px", maxWidth: "100%" }}
                />
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | "ALL")}
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
                    onClick={() => { setSearchQuery(""); setPriorityFilter("ALL"); }}
                    style={{ padding: "8px 14px", cursor: "pointer" }}
                >
                    Clear Filters
                </button>
            </div>

            <p style={{ marginBottom: "15px" }}>
                Showing {displayTasks.length} of {tasks.length} tasks
            </p>

            {/* Kanban Columns */}
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", alignItems: "stretch", paddingBottom: "10px" }}>
                {renderColumn("TODO",        "📌 To Do",      "#ffebee")}
                {renderColumn("IN_PROGRESS", "⏳ In Progress", "#fff3e0")}
                {renderColumn("REVIEW",      "👀 Review",     "#e3f2fd")}
                {renderColumn("DONE",        "✅ Done",       "#e8f5e9")}
            </div>
        </div>
    );
}
