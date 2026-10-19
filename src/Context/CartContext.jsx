import { createContext, useContext, useState, useEffect } from 'react'
import { CartService } from '../Services/CartService'

const CartContext = createContext()

const TAX_RATE = 0

const COUPONS = {
  may26: 20,
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [coupon, setCoupon] = useState(null)

  const [savedItems, setSavedItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_items')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('saved_items', JSON.stringify(savedItems))
  }, [savedItems])

  const loadCart = () => {
    if (!localStorage.getItem('auth_token')) {
      setCartItems([])
      return Promise.resolve()
    }

    return CartService.GetCart()

      .then((items) => setCartItems(items.filter((item) => item.product)))
      .catch((err) => console.log(err.message))
  }

  useEffect(() => {
    loadCart()
  }, [])

  const addToCart = (productId, amount = 1) => {
    return CartService.GetCart()
      .then((items) => {
        const existing = items.find((item) => item.product && item.product.id === productId)
        const newQuantity = existing ? existing.quantity + amount : amount
        return CartService.AddToCart(productId, newQuantity)
      })
      .then(loadCart)
  }

  const setQuantity = (item, quantity) => {
    if (quantity < 1) return
    CartService.AddToCart(item.product.id, quantity)
      .then(loadCart)
      .catch((err) => console.log(err.message))
  }

  const increaseQuantity = (item) => setQuantity(item, item.quantity + 1)

  const decreaseQuantity = (item) => {
    if (item.quantity <= 1) return
    setQuantity(item, item.quantity - 1)
  }

  const removeFromCart = (item) => {
    CartService.RemoveFromCart(item.id)
      .then(loadCart)
      .catch((err) => console.log(err.message))
  }

  const removeAll = () => {
    Promise.all(cartItems.map((item) => CartService.RemoveFromCart(item.id)))
      .then(loadCart)
      .catch((err) => console.log(err.message))
  }

  const saveForLater = (item) => {
    const alreadySaved = savedItems.some((s) => s.productId === item.product.id)

    if (!alreadySaved) {
      setSavedItems([
        ...savedItems,
        {
          productId: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.image,
          quantity: item.quantity,
        },
      ])
    }

    removeFromCart(item)
  }

  const moveToCart = (saved) => {
    return CartService.GetCart()
      .then((items) => {
        const existing = items.find((item) => item.product && item.product.id === saved.productId)
        const newQuantity = existing ? existing.quantity + saved.quantity : saved.quantity
        return CartService.AddToCart(saved.productId, newQuantity)
      })
      .then(() => {
        setSavedItems((list) => list.filter((s) => s.productId !== saved.productId))
        return loadCart()
      })
      .catch((err) => console.log(err.message))
  }

  const removeSaved = (productId) => {
    setSavedItems(savedItems.filter((s) => s.productId !== productId))
  }

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toLowerCase()
    const percent = COUPONS[cleanCode]

    if (!percent) return false

    setCoupon({ code: cleanCode, percent: percent })
    return true
  }

  const removeCoupon = () => setCoupon(null)

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  )

  const discount = coupon ? (subtotal * coupon.percent) / 100 : 0
  const tax = (subtotal - discount) * TAX_RATE
  const total = subtotal - discount + tax

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedItems,
        loadCart,
        addToCart,
        setQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        removeAll,
        saveForLater,
        moveToCart,
        removeSaved,
        subtotal,
        coupon,
        applyCoupon,
        removeCoupon,
        discount,
        tax,
        total,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)