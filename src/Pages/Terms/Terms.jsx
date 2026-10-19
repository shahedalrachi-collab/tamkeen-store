import { useNavigate } from 'react-router'
import { FaCaretLeft } from 'react-icons/fa'
import SettingLayout from '../../layout/SettingLayout'

const PINK = '#f0345d'

const sampleText =
  'By using this application, you acknowledge that you have read, understood, and agree to fully comply with these terms. If you do not agree with these terms, please do not use the application. The application management reserves the right to modify these terms at any time, and you will be notified of updates when necessary.'

const terms = [
  { id: 1, title: 'Acceptance of Terms', text: sampleText },
  { id: 2, title: 'Account Creation and Use', text: sampleText },
  { id: 3, title: 'Acceptance of Terms', text: sampleText },
  { id: 4, title: 'Intellectual Property Rights', text: sampleText },
  { id: 5, title: 'Acceptance of Terms', text: sampleText },
]

const Terms = () => {
  const navigate = useNavigate()

  return (
    <SettingLayout>
            <div
        className="d-flex align-items-center gap-3 px-4 text-white"
        style={{
          height: 54,
          borderRadius: '8px 8px 0 0',
          background: 'linear-gradient(90deg, #f3355f, #d89aa8)',
        }}
      >
        <button
          type="button"
          className="border-0 bg-transparent text-white p-0"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <FaCaretLeft size={24} />
        </button>
        <span className="small">Terms and condition</span>
      </div>

            <div
        className="px-4 pt-3"
        style={{
          background: 'var(--surface)',
          borderRadius: '0 0 8px 8px',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        {terms.map((item, index) => (
          <div
            key={item.id}
            className="py-3"
            style={{ borderBottom: index < terms.length - 1 ? '1px solid var(--line)' : 'none' }}
          >
            <h5 style={{ color: PINK }}>{item.title}</h5>
            <p className="small mb-0" style={{ color: 'var(--body-text)' }}>{item.text}</p>
          </div>
        ))}
      </div>
    </SettingLayout>
  )
}

export default Terms