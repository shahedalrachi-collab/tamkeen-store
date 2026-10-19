import { useNavigate } from 'react-router'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useFavorites } from '../Context/Favoritescontext'

const FavoriteButton = ({ productId, className = '', style = {} }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const navigate = useNavigate()

  const favorite = isFavorite(productId)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (productId === undefined) {
      console.warn('FavoriteButton: productId is missing, pass productId={...} to it')
      return
    }

    if (!localStorage.getItem('auth_token')) {
      navigate('/login')
      return
    }

    if (favorite) {
      removeFavorite(productId)
    } else {
      addFavorite(productId)
    }
  }

  return (
    <button
      type="button"
      className={`border-0 bg-transparent p-1 ${className}`}
      style={style}
      onClick={handleClick}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorite ? (
        <FaHeart size={18} color="#f0345d" />
      ) : (
        <FaRegHeart size={18} color="var(--muted-text)" />
      )}
    </button>
  )
}

export default FavoriteButton