import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Form from 'react-bootstrap/Form'
import Overlay from 'react-bootstrap/Overlay'
import { SearchService } from '../Services/SearchService'

const PINK = '#f0345d'

const SearchBox = ({ text, setText }) => {
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const word = text.trim()

    if (!open || !word) {
      setResults([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    const timer = setTimeout(() => {
      SearchService.SearchProducts(word)
        .then((products) => {
          if (!cancelled) setResults(products.slice(0, 6))
        })
        .catch(() => {
          if (!cancelled) setResults([])
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [text, open])

  const handleSelect = (id) => {
    navigate(`/products/${id}`)
    setOpen(false)
    setText('')
  }

  return (
    <>
      <Form.Control
        ref={inputRef}
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {

          if (e.key === 'Enter' || e.key === 'Escape') setOpen(false)
        }}
      />

      <Overlay
        target={inputRef.current}
        show={open && !!text.trim()}
        placement="bottom-start"
        rootClose
        onHide={() => setOpen(false)}
      >

        {({ placement: _placement, arrowProps: _arrowProps, show: _show, popper: _popper, hasDoneInitialMeasure: _measure, ...props }) => (
          <div
            {...props}
            className="list-group shadow"
            style={{
              ...props.style,
              width: inputRef.current ? inputRef.current.offsetWidth : 300,
              maxHeight: 360,
              overflowY: 'auto',
              zIndex: 1060,
            }}
          >
            {loading && results.length === 0 && (
              <div className="list-group-item small">Searching...</div>
            )}

            {!loading && results.length === 0 && (
              <div className="list-group-item small">No products found</div>
            )}

            {results.map((product) => (
              <button
                key={product.id}
                type="button"
                className="list-group-item list-group-item-action d-flex align-items-center gap-3"
                onClick={() => handleSelect(product.id)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: 40, height: 40, objectFit: 'contain' }}
                />
                <span className="flex-grow-1 small text-start">{product.name}</span>
                <span className="small fw-semibold" style={{ color: PINK }}>
                  ${product.price}
                </span>
              </button>
            ))}
          </div>
        )}
      </Overlay>
    </>
  )
}

export default SearchBox