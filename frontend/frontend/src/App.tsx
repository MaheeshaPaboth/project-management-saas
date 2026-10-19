
import TaskList from "./components/TaskList";

function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Project Management App</h1>
        <p>Please log in to view your tasks.</p>
      </div>
    );
  }

  return (
    <main>
      <TaskList projectId={1} token={token} />
    </main>
  );
}

export default App;
