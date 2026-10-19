import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FaUserCircle, FaCaretRight } from 'react-icons/fa'

import SettingLayout from '../../layout/SettingLayout'
import SuccessModal from '../../Components/Shared/SuccessModal'
import { ProfileService } from '../../Services/ProfileService'
import { AuthContext } from '../../Context/AuthContext'
import { Container } from 'react-bootstrap'

const PINK = '#f0345d'

const boxStyle = { background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--body-text)' }
const fieldStyle = { background: 'var(--surface-soft)', color: 'var(--heading)' }

const settingsLinks = [
  { label: 'Terms and condition', to: '/terms' },
  { label: 'Privacy Policy page', to: '/privacy' },
  { label: 'Contact us page', to: '/contact-us' },
  { label: 'My products', to: '/Myproducts' },
  { label: 'Favorites', to: '/favorites' },
]

const Profile = () => {
  const { updateUser } = useContext(AuthContext)

  const isLoggedIn = !!localStorage.getItem('auth_token')

  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [newImage, setNewImage] = useState(null)
  const [preview, setPreview] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const loadProfile = () => {
    return ProfileService.GetProfile().then((data) => {
      setProfile(data)
      setForm({ name: data.name, email: data.email, phone: data.phone })

      updateUser({ name: data.name, email: data.email, phone: data.phone })
    })
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }

    loadProfile()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setNewImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setFieldErrors({})

    const changes = { name: form.name }
    if (form.email !== profile.email) changes.email = form.email
    if (form.phone !== profile.phone) changes.phone = form.phone
    if (newImage) changes.image = newImage

    ProfileService.UpdateProfile(changes)
      .then(() => loadProfile())
      .then(() => {
        setNewImage(null)
        setPreview('')
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
      .finally(() => setSaving(false))
  }

  if (!isLoggedIn) {
    return (
      <SettingLayout>
        <div className="rounded p-5 text-center" style={boxStyle}>
          <p className="mb-3">Please log in to see your profile.</p>
          <Link to="/login" className="btn text-white" style={{ backgroundColor: PINK }}>
            Login
          </Link>
        </div>
      </SettingLayout>
    )
  }

  if (loading) {
    return (
      <SettingLayout>
        <p className="text-center my-5" style={{ color: 'var(--body-text)' }}>
          Loading your profile...
        </p>
      </SettingLayout>
    )
  }

  const avatarSrc = preview || profile?.image

  return (
    <SettingLayout>
      <Container className="py-5">

                 <div
        style={{
          height: 54,
          borderRadius: '8px 8px 0 0',
          background: 'linear-gradient(90deg, #f3355f, #d89aa8)',
        }}
      ></div>

      <div
        className="p-4"
        style={{ background: 'var(--surface)', color: 'var(--body-text)', borderRadius: '0 0 8px 8px' }}
      >
                <div className="d-flex align-items-center gap-3 mb-4">
          <label htmlFor="profile-image" style={{ cursor: 'pointer' }} title="Change photo">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Profile"
                style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <FaUserCircle size={70} color="#C7E1FF" />
            )}
          </label>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="d-none"
            onChange={handleImage}
          />

          <div>
            <div className="fw-semibold" style={{ color: 'var(--heading)' }}>{profile?.name}</div>
            <div className="small" style={{ color: 'var(--muted-text)' }}>{profile?.email}</div>
          </div>
        </div>

                <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="small mb-1" htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                className="form-control border-0"
                style={fieldStyle}
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
              {fieldErrors.name && <small className="text-danger">{fieldErrors.name[0]}</small>}
            </div>

            <div className="col-md-4">
              <label className="small mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control border-0"
                style={fieldStyle}
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
              />
              {fieldErrors.email && <small className="text-danger">{fieldErrors.email[0]}</small>}
            </div>

            <div className="col-md-4">
              <label className="small mb-1" htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-control border-0"
                style={fieldStyle}
                placeholder="Your phone"
                value={form.phone}
                onChange={handleChange}
              />
              {fieldErrors.phone && <small className="text-danger">{fieldErrors.phone[0]}</small>}
            </div>
          </div>

          <button
            type="submit"
            className="btn text-white px-4"
            style={{ backgroundColor: PINK }}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Submit update'}
          </button>

          {error && <div className="alert alert-warning mt-3">{error}</div>}
        </form>

                <div className="mt-4">
          <div className="small mb-2">Settings</div>

          <div className="row g-3">
            {settingsLinks.map((link) => (
              <div className="col-md-4" key={link.label}>
                <Link
                  to={link.to}
                  className="d-flex justify-content-between align-items-center p-3 rounded text-decoration-none small"
                  style={{ background: 'var(--surface-soft)', color: 'var(--heading)' }}
                >
                  {link.label}
                  <FaCaretRight size={20} color={PINK} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

            <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="your information has been updated successfully"
      />

      </Container>

    </SettingLayout>
  )
}

export default Profile