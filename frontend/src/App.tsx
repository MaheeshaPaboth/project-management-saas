import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ProjectDashboard from "./components/ProjectDashboard";

function App() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("jwt_token");
  });

  // Login සාර්ථක වූ විට
  function handleLoginSuccess(newToken: string) {
    localStorage.setItem("jwt_token", newToken);
    setToken(newToken);
  }

  // Logout කරන විට
  function handleLogout() {
    localStorage.removeItem("jwt_token");
    setToken(null);
  }

  // Token එකක් නැත්නම් Login Form එක
  if (!token) {
    return (
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    );
  }

  // Token එකක් තිබෙනවා නම් Dashboard එක
  return (
    <ProjectDashboard
      token={token}
      onLogout={handleLogout}
    />
  );
}

export default App;