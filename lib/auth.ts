export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("mock_logged_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}