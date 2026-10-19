import React from 'react'
import { useNavigate } from 'react-router'
import { useCart } from '../Context/CartContext'
import FavoriteButton from './Favoritebutton'

const RecomendedCards = ({ id, img, title, price }) => {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleAdd = (e) => {
    e.preventDefault()

    if (!localStorage.getItem('auth_token')) {
      navigate('/login')
      return
    }

    addToCart(id).catch((err) => console.log(err.message))
  }

  return (
    <>
      <div className="reco-card position-relative">
        <FavoriteButton
          productId={id}
          className="position-absolute"
          style={{ top: 8, right: 8, zIndex: 1 }}
        />

        <div className="reco-card-img-wrap d-flex gap-3 justify-content-center mb-3 ">
          {img}
        </div>

        <div className="reco-card-body px-3">
          <p className="reco-card-price">${price}</p>
          <span className="reco-card-title">{title}</span>
        </div>

        <div className="px-3 pb-3 mt-2">
          <button
            type="button"
            className="btn btn-sm w-100 text-white"
            style={{ backgroundColor: '#f0345d' }}
            onClick={handleAdd}
          >
            Add to cart
          </button>
        </div>
      </div>
    </>
  )
}

export default RecomendedCards