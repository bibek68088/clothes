import { type ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../store/useAuth"
import { Loader } from "@mantine/core"

interface AuthGuardProps {
  children: ReactNode
  adminRequired?: boolean
}

export function AuthGuard({ children, adminRequired = false }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } })
    } else if (adminRequired && user?.role !== "admin") {
      navigate("/")
    }
  }, [isAuthenticated, user, adminRequired, navigate, location.pathname])

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    )
  }

  if (adminRequired && user?.role !== "admin") {
    return null 
  }

  return <>{children}</>
}

