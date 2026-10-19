import { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import { FaCaretLeft } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { FiMessageSquare } from 'react-icons/fi'

import SettingLayout from '../../layout/SettingLayout'
import SuccessModal from '../../Components/Shared/SuccessModal'
import { ContactService } from '../../Services/ContactService'
import { AuthContext } from '../../Context/AuthContext'

const PINK = '#f0345d'

const inputStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  color: 'var(--heading)',
  paddingRight: 46,
}

const iconStyle = { position: 'absolute', right: 16, color: PINK }

const ContactUs = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [form, setForm] = useState({
    email: user?.email || '',
    message: '',
  })

  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    setFieldErrors({})

    ContactService.SendMessage(form)
      .then(() => {
        setForm({ ...form, message: '' })
        setShowSuccess(true)
      })
      .catch((err) => {
        if (err instanceof TypeError) {
          setError("Can't reach the server. Check your internet connection and try again.")
          return
        }
        setFieldErrors(err.errors || {})
        setError(err.message)
      })
      .finally(() => setSending(false))
  }

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
        <span className="small">Contact us page</span>
      </div>

      <div className="p-4" style={{ background: 'var(--surface-soft)', borderRadius: '0 0 8px 8px' }}>
        <form onSubmit={handleSubmit}>
                    <div className="mb-3">
            <div className="d-flex align-items-center position-relative">
              <input
                name="email"
                type="email"
                className="form-control py-3"
                style={inputStyle}
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <HiOutlineMail size={18} style={iconStyle} />
            </div>
            {fieldErrors.email && <small className="text-danger">{fieldErrors.email[0]}</small>}
          </div>

                    <div className="mb-3">
            <div className="position-relative">
              <textarea
                name="message"
                className="form-control"
                style={{ ...inputStyle, height: 160, resize: 'none' }}
                placeholder="Write message"
                value={form.message}
                onChange={handleChange}
                required
              />
              <FiMessageSquare size={18} style={{ ...iconStyle, top: 16 }} />
            </div>
            {fieldErrors.message && <small className="text-danger">{fieldErrors.message[0]}</small>}
          </div>

          <button
            type="submit"
            className="btn w-100 text-white py-3 fw-semibold"
            style={{ backgroundColor: PINK }}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>

          {error && <div className="alert alert-warning mt-3 mb-0">{error}</div>}
        </form>
      </div>

            <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="your message has been sent successfully"
      />
    </SettingLayout>
  )
}

export default ContactUs