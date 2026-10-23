
const API_URL = "http://localhost:8080";

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Sends login request to the backend.
 * Returns the JWT token string on success.
 * Throws an error with a readable message on failure.
 */
export async function login(credentials: LoginCredentials): Promise<string> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

    if (!response.ok) {
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        throw new Error("Invalid email or password. Please try again.");
      }
      throw new Error(`Login failed: ${response.status}`);
    }

  // Backend returns the JWT token as a plain string
  const token = await response.text();
  return token;
}
