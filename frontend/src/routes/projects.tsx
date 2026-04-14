import { Helmet } from 'react-helmet-async'
import { ProjectsPage } from '@/components/pages/projects-page'

export default function ProjectsRoute() {
  return (
    <>
      <Helmet>
        <title>Projects - TaskFlow</title>
        <meta name="description" content="Manage and track all your projects" />
      </Helmet>
      <ProjectsPage />
    </>
  )
}
