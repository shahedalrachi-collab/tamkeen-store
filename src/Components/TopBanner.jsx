import { useContext } from 'react'
import { Container } from 'react-bootstrap'
import { FaMoon, FaSun, FaTruck, FaPhoneAlt } from 'react-icons/fa'
import { ThemeContext } from '../Context/ThemeContext'
import { LanguageContext } from '../Context/LanguageContext'

const texts = {
  en: {
    offer: 'Free shipping on orders over $50',
    help: 'Need help?',
    langBtn: 'العربية',
    darkBtn: 'Dark',
    lightBtn: 'Light',
  },
  ar: {
    offer: 'شحن مجاني للطلبات فوق 50$',
    help: 'تحتاج مساعدة؟',
    langBtn: 'English',
    darkBtn: 'داكن',
    lightBtn: 'فاتح',
  },
}

const TopBanner = () => {
  const { mode, toggleMode } = useContext(ThemeContext)
  const { lang, toggleLang } = useContext(LanguageContext)
  const t = texts[lang]

  return (
    <div className="top-banner py-2">
      <Container className="d-flex justify-content-between align-items-center gap-3 flex-wrap">

        <div className="d-flex align-items-center gap-4">
          <span className="d-flex align-items-center gap-2">
            <FaTruck className="top-banner-icon" />
            {t.offer}
          </span>
          <span className="d-none d-md-flex align-items-center gap-2">
            <FaPhoneAlt className="top-banner-icon" />
            {t.help} <span dir="ltr">+1 555 012 3456</span>
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="top-banner-btn" onClick={toggleLang} aria-label="Change language">
            {t.langBtn}
          </button>

          <button
            className="top-banner-btn"
            onClick={toggleMode}
            aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {mode === 'light' ? <FaMoon /> : <FaSun className="top-banner-icon" />}
            {mode === 'light' ? t.darkBtn : t.lightBtn}
          </button>
        </div>

      </Container>
    </div>
  )
}

export default TopBanner