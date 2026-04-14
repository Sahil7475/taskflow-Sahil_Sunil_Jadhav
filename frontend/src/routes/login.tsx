import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '@/contexts/auth-context'
import { LoginPage } from '@/components/pages/login-page'
import { Spinner } from '@/components/ui/spinner'

export default function LoginRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/projects', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <>
      <Helmet>
        <title>Sign In - TaskFlow</title>
        <meta name="description" content="Sign in to your TaskFlow account" />
      </Helmet>
      <LoginPage />
    </>
  )
}
