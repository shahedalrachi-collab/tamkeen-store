import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {

  const [mode, setMode] = useState('light')

  useEffect(() => {
    const themeColorInStorage = localStorage.getItem('theme-color') || 'light'

    if (themeColorInStorage) {
      setMode(themeColorInStorage)
      document.body.setAttribute('data-bs-theme', themeColorInStorage)
    }
  }, [])

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('theme-color', newMode)
    document.body.setAttribute('data-bs-theme', newMode)
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}