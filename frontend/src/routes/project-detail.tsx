import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ProjectDetailPage } from '@/components/pages/project-detail-page'

export default function ProjectDetailRoute() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return null
  }

  return (
    <>
      <Helmet>
        <title>Project Details - TaskFlow</title>
        <meta name="description" content="View and manage project tasks" />
      </Helmet>
      <ProjectDetailPage projectId={id} />
    </>
  )
}
