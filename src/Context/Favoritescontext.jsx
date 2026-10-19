import { createContext, useContext, useState, useEffect } from 'react'
import { FavoriteService } from '../Services/Favoriteservice'

const FavoriteContext = createContext()

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const loadFavorites = () => {
    if (!localStorage.getItem('auth_token')) {
      setFavorites([])
      return Promise.resolve()
    }

    return FavoriteService.GetFavorites()

      .then((items) => setFavorites(items.filter((item) => item.product)))
      .catch((err) => console.log(err.message))
  }

  useEffect(() => {
    loadFavorites().finally(() => setLoading(false))
  }, [])

  const isFavorite = (productId) => {
    return favorites.some((item) => item.product.id === productId)
  }

  const addFavorite = (productId) => {
    setFavorites([...favorites, { id: 0, product: { id: productId } }])

    return FavoriteService.AddFavorite(productId)
      .then(loadFavorites)
      .catch((err) => {
        console.log(err.message)
        loadFavorites()
      })
  }

  const removeFavorite = (productId) => {
    setFavorites(favorites.filter((item) => item.product.id !== productId))

    return FavoriteService.RemoveFavorite(productId)
      .then(loadFavorites)
      .catch((err) => {
        console.log(err.message)
        loadFavorites()
      })
  }

  const favoritesCount = favorites.length

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        loading,
        loadFavorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        favoritesCount,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoriteContext)