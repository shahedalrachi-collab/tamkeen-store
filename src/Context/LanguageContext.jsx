import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {

  const [lang, setLang] = useState('en')

  const applyLang = (newLang) => {
    document.documentElement.setAttribute('lang', newLang)
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
  }

  useEffect(() => {
    const langInStorage = localStorage.getItem('lang') || 'en'
    setLang(langInStorage)
    applyLang(langInStorage)
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en'
    setLang(newLang)
    localStorage.setItem('lang', newLang)
    applyLang(newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}