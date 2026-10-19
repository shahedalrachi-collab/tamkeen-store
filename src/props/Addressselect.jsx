import { useEffect, useState } from 'react'
import { AddressService } from '../Services/AddressService'
import AddressModal from '../Components/AddressModal'

const AddressSelect = ({ selectedId, onSelect }) => {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const loadAddresses = (selectNewest) => {
    return AddressService.GetAddresses().then((list) => {
      setAddresses(list)

      if (list.length === 0) {
        onSelect('')
        return
      }

      if (selectNewest) {

        onSelect(Math.max(...list.map((a) => a.id)))
      } else {

        const defaultAddress = list.find((a) => a.is_default) || list[0]
        onSelect(defaultAddress.id)
      }
    })
  }

  useEffect(() => {
    loadAddresses(false)
      .catch((err) => console.log(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    if (e.target.value === 'new') {
      setShowModal(true)
    } else {
      onSelect(Number(e.target.value))
    }
  }

  const handleSaved = () => {
    setShowModal(false)
    loadAddresses(true).catch((err) => console.log(err.message))
  }

  return (
    <>
      <select
        className="form-select"
        style={{
          background: 'rgba(255,255,255,0.12)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.3)',
        }}
        value={selectedId || ''}
        onChange={handleChange}
        disabled={loading}
        aria-label="Delivery address"
      >
        {addresses.length === 0 && (
          <option value="" style={{ background: 'var(--surface)', color: 'var(--heading)' }}>
            {loading ? 'Loading...' : 'No saved addresses'}
          </option>
        )}

        {addresses.map((address) => (
          <option
            key={address.id}
            value={address.id}
            style={{ background: 'var(--surface)', color: 'var(--heading)' }}
          >
            {address.name} - {address.street}, {address.city}
          </option>
        ))}

        <option value="new" style={{ background: 'var(--surface)', color: 'var(--heading)' }}>
          + Add new address
        </option>
      </select>

      <AddressModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSaved={handleSaved}
      />
    </>
  )
}

export default AddressSelect