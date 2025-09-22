export interface User {
  id: string
  email: string
  name: string
  role: "admin"
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const isAuthenticated = localStorage.getItem("isAuthenticated")
  const userEmail = localStorage.getItem("userEmail")

  if (isAuthenticated === "true" && userEmail) {
    return {
      id: "1",
      email: userEmail,
      name: "Admin User",
      role: "admin",
    }
  }

  return null
}

export function logout() {
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userEmail")
  window.location.href = "/"
}
