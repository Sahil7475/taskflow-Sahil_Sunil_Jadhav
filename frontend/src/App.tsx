import { Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Providers } from '@/components/providers'
import { ProtectedRoute } from '@/components/protected-route'
import { Navbar } from '@/components/navbar'
import HomePage from '@/src/routes/home'
import LoginRoute from '@/src/routes/login'
import RegisterRoute from '@/src/routes/register'
import ProjectsRoute from '@/src/routes/projects'
import ProjectDetailRoute from '@/src/routes/project-detail'

function App() {
  return (
    <HelmetProvider>
      <Providers>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/register" element={<RegisterRoute />} />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <ProjectsRoute />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <ProjectDetailRoute />
                </div>
              </ProtectedRoute>
            }
          />
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Providers>
    </HelmetProvider>
  )
}

export default App
