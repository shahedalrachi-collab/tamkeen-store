import { useContext, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { AddressService } from '../Services/Addressservice'
import { AuthContext } from '../Context/AuthContext'

const PINK = '#f0345d'

const quickNames = ['Home', 'Work', 'Other']

const fields = [
  { name: 'phone', label: 'Phone', type: 'tel', required: true },
  { name: 'city', label: 'City', required: true },
  { name: 'street', label: 'Street', required: true },
  { name: 'neighborhood', label: 'Neighborhood' },
  { name: 'building', label: 'Building' },
  { name: 'zip_code', label: 'Zip code' },
]

const fieldStyle = {
  background: 'var(--surface-soft)',
  color: 'var(--heading)',
  border: '1px solid var(--line)',
}

const AddressModal = ({ show, onClose, onSaved }) => {
  const { user } = useContext(AuthContext)

  const emptyForm = {
    name: 'Home',
    phone: user?.phone || '',
    city: '',
    street: '',
    neighborhood: '',
    building: '',
    zip_code: '',
  }

  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setFieldErrors({})

    AddressService.AddAddress(form)
      .then(() => {
        setForm(emptyForm)
        onSaved()
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

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">Add new address</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
                    <label className="small mb-1" htmlFor="address-name">Address name</label>
          <input
            id="address-name"
            name="name"
            className="form-control mb-2"
            style={fieldStyle}
            placeholder="Home, Work..."
            value={form.name}
            onChange={handleChange}
            required
          />
          {fieldErrors.name && <small className="text-danger">{fieldErrors.name[0]}</small>}

          <div className="d-flex gap-2 mb-3">
            {quickNames.map((quick) => (
              <button
                key={quick}
                type="button"
                className="btn btn-sm"
                style={{
                  background: form.name === quick ? PINK : 'transparent',
                  color: form.name === quick ? '#fff' : PINK,
                  border: `1px solid ${PINK}`,
                }}
                onClick={() => setForm({ ...form, name: quick })}
              >
                {quick}
              </button>
            ))}
          </div>

                    <div className="row g-3 mb-3">
            {fields.map((field) => (
              <div className="col-md-6" key={field.name}>
                <label className="small mb-1" htmlFor={`address-${field.name}`}>
                  {field.label}
                </label>
                <input
                  id={`address-${field.name}`}
                  name={field.name}
                  type={field.type || 'text'}
                  className="form-control"
                  style={fieldStyle}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                />
                {fieldErrors[field.name] && (
                  <small className="text-danger">{fieldErrors[field.name][0]}</small>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="btn w-100 text-white"
            style={{ backgroundColor: PINK }}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save address'}
          </button>

          {error && <div className="alert alert-warning mt-3 mb-0">{error}</div>}
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default AddressModal