import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import Overlay from 'react-bootstrap/Overlay'
import { ProductService } from '../Services/ProductService'

const PINK = '#f0345d'

const CategoryDropdown = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const buttonRef = useRef(null)
  const filterRef = useRef(null)

  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    ProductService.GetAllCategories()
      .then((list) => setCategories(list))
      .catch((err) => console.log(err.message))
  }, [])

  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      if (filterRef.current) filterRef.current.focus({ preventScroll: true })
    }, 100)

    return () => clearTimeout(timer)
  }, [open])

  const selectedId = Number(searchParams.get('category')) || null
  const selectedCategory = categories.find((cat) => cat.id === selectedId)

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(filter.trim().toLowerCase())
  )

  const handleSelect = (id) => {
    navigate(id ? `/products?category=${id}` : '/products')
    setOpen(false)
    setFilter('')
  }

  return (
    <>

      <button
        ref={buttonRef}
        type="button"
        className="form-select text-start text-truncate"
        onClick={() => setOpen(!open)}
      >
        {selectedCategory ? selectedCategory.name : 'All category'}
      </button>

      <Overlay
        target={buttonRef.current}
        show={open}
        placement="bottom-end"
        rootClose
        onHide={() => setOpen(false)}
      >

        {({ placement: _placement, arrowProps: _arrowProps, show: _show, popper: _popper, hasDoneInitialMeasure: _measure, ...props }) => (
          <div
            {...props}
            className="rounded shadow p-2"
            style={{
              ...props.style,
              width: 260,
              zIndex: 1060,
              background: 'var(--surface)',
              border: '1px solid var(--line)',
            }}
          >
                        <input
              className="form-control form-control-sm mb-2"
              placeholder="Filter categories..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              ref={filterRef}
            />

                        <div
              className="list-group list-group-flush"
              style={{
                maxHeight: 240,
                overflowY: 'auto',
                '--bs-list-group-bg': 'transparent',
                '--bs-list-group-color': 'var(--heading)',
                '--bs-list-group-action-color': 'var(--heading)',
                '--bs-list-group-action-hover-color': 'var(--heading)',
                '--bs-list-group-action-hover-bg': 'var(--surface-soft)',
                '--bs-list-group-border-color': 'var(--line)',
              }}
            >
              <button
                type="button"
                className="list-group-item list-group-item-action"
                style={!selectedId ? { color: PINK, fontWeight: 600 } : {}}
                onClick={() => handleSelect(null)}
              >
                All categories
              </button>

              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="list-group-item list-group-item-action"
                  style={cat.id === selectedId ? { color: PINK, fontWeight: 600 } : {}}
                  onClick={() => handleSelect(cat.id)}
                >
                  {cat.name}
                </button>
              ))}

              {filteredCategories.length === 0 && (
                <div className="list-group-item small">No categories found</div>
              )}
            </div>
          </div>
        )}
      </Overlay>
    </>
  )
}

export default CategoryDropdown