
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

    useEffect(() => {
        let cancelled = false;

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

                if (!cancelled) {
                    setProjects(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Could not connect to the server."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchProjects();

        return () => {
            cancelled = true;
        };
    }, [token, onLogout]);

    // Selected project එකේ Kanban Board එක පෙන්වීම
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
                    <button
                        onClick={() => setSelectedProjectId(null)}
                    >
                        ← Back to Projects
                    </button>

                    <button onClick={onLogout}>
                        Logout
                    </button>
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
                }}
            >
                <h1>My Projects 📁</h1>
                <button onClick={onLogout}>Logout</button>
            </header>

            {projects.length === 0 ? (
                <p>No projects yet. Create your first project!</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gap: "15px",
                        marginTop: "20px",
                    }}
                >
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                borderRadius: "8px",
                            }}
                        >
                            <h2>{project.name}</h2>

                            <p>
                                {project.description ||
                                    "No description available."}
                            </p>

                            <button
                                onClick={() =>
                                    setSelectedProjectId(project.id)
                                }
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
