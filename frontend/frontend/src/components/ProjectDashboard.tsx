
import { useEffect, useState } from "react";
import KanbanBoard from "./KanbanBoard";

interface Project {
    id: number;
    name: string;
    description: string;
}

interface ProjectDashboardProps {
    token: string;
    onLogout: () => void;
}

export default function ProjectDashboard({
    token,
    onLogout,
}: ProjectDashboardProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProjectId, setSelectedProjectId] =
        useState<number | null>(null);

    // Create-project form state
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    async function fetchProjects() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/projects/org/1",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("jwt_token");
                onLogout();
                return;
            }

            if (response.status === 403) {
                throw new Error(
                    "Access denied (403). Check your JWT and project permissions."
                );
            }

            if (!response.ok) {
                throw new Error(
                    `Failed to load projects: ${response.status}`
                );
            }

            const data: Project[] = await response.json();
            setProjects(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    async function handleCreateProject(e: React.FormEvent) {
        e.preventDefault();
        if (!newName.trim()) return;

        setCreating(true);
        setCreateError("");

        try {
            const response = await fetch("http://localhost:8080/projects", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newName.trim(),
                    description: newDesc.trim(),
                    organizationId: 1,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create project: ${response.status}`);
            }

            // Reset form & refresh list
            setNewName("");
            setNewDesc("");
            setShowForm(false);
            await fetchProjects();
        } catch (err) {
            setCreateError(
                err instanceof Error ? err.message : "Could not create project."
            );
        } finally {
            setCreating(false);
        }
    }

    // Kanban Board view
    if (selectedProjectId !== null) {
        return (
            <div style={{ padding: "20px" }}>
                <header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        marginBottom: "20px",
                    }}
                >
                    <button onClick={() => setSelectedProjectId(null)}>
                        ← Back to Projects
                    </button>
                    <button onClick={onLogout}>Logout</button>
                </header>
                <KanbanBoard projectId={selectedProjectId} />
            </div>
        );
    }

    if (loading) {
        return (
            <h2 style={{ textAlign: "center", padding: "40px" }}>
                Loading your workspace...
            </h2>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Dashboard Error</h2>
                <p style={{ color: "red" }}>{error}</p>
                <button onClick={onLogout}>Logout</button>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "800px",
                margin: "0 auto",
                fontFamily: "sans-serif",
            }}
        >
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <h1>My Projects 📁</h1>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        id="btn-create-project"
                        onClick={() => {
                            setShowForm((v) => !v);
                            setCreateError("");
                        }}
                        style={{
                            background: "#4f46e5",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 14px",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        {showForm ? "✕ Cancel" : "+ New Project"}
                    </button>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </header>

            {/* Create Project Form */}
            {showForm && (
                <form
                    onSubmit={handleCreateProject}
                    style={{
                        border: "1px solid #4f46e5",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "24px",
                        background: "#1e1b4b",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <h3 style={{ margin: 0, color: "#c7d2fe" }}>
                        Create New Project
                    </h3>

                    <input
                        id="input-project-name"
                        type="text"
                        placeholder="Project name *"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #6366f1",
                            background: "#312e81",
                            color: "#fff",
                            fontSize: "15px",
                        }}
                    />

                    <textarea
                        id="input-project-description"
                        placeholder="Description (optional)"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        rows={3}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #6366f1",
                            background: "#312e81",
                            color: "#fff",
                            fontSize: "15px",
                            resize: "vertical",
                        }}
                    />

                    {createError && (
                        <p style={{ color: "#f87171", margin: 0 }}>
                            ⚠ {createError}
                        </p>
                    )}

                    <button
                        id="btn-submit-project"
                        type="submit"
                        disabled={creating}
                        style={{
                            background: creating ? "#6366f1" : "#4f46e5",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px",
                            cursor: creating ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            fontSize: "15px",
                        }}
                    >
                        {creating ? "Creating…" : "✓ Create Project"}
                    </button>
                </form>
            )}

            {/* Project list */}
            {projects.length === 0 ? (
                <p style={{ color: "#9ca3af" }}>
                    No projects yet. Click <strong>+ New Project</strong> to get started!
                </p>
            ) : (
                <div style={{ display: "grid", gap: "15px" }}>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            style={{
                                border: "1px solid #374151",
                                padding: "16px",
                                borderRadius: "8px",
                                background: "#111827",
                            }}
                        >
                            <h2 style={{ margin: "0 0 6px" }}>{project.name}</h2>
                            <p style={{ margin: "0 0 12px", color: "#9ca3af" }}>
                                {project.description || "No description available."}
                            </p>
                            <button
                                onClick={() => setSelectedProjectId(project.id)}
                                style={{
                                    background: "#4f46e5",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "8px 14px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                }}
                            >
                                View Board ➡️
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

