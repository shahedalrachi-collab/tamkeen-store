import { Container } from 'react-bootstrap'
import PageLayout from '../../layout/PageLayout'

const Privacy = () => {
  return (
    <PageLayout>
      <Container className="py-5">
        <h2 className="mb-4">Privacy Policy</h2>
        <p>
          Write your privacy policy here. Explain what information you collect and how you use
          it.
        </p>
      </Container>
    </PageLayout>
  )
}

export default Privacy