import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import logo from '../../assets/imgs/logo.png'
import { Link, useNavigate } from 'react-router';
import { useState, useContext } from 'react';
import CartOffcanvas from '../CartOffcanvas';

import { useCart } from '../../Context/CartContext'
import { useFavorites } from '../../Context/Favoritescontext'
import { AuthContext } from '../../Context/AuthContext'

import {
  FaShoppingCart,
  FaUser,
  FaUserCircle,
  FaHeart,
  FaBox
} from 'react-icons/fa';
import { FiHome, FiGrid, FiHeart, FiArchive, FiHeadphones, FiBox } from 'react-icons/fi';
import IconLink from '../../props/IconLink';

const desktopIconLinks = [
  { label: "Profile", icon: <FaUser />, to: "/profile" },
  { label: "Favorites", icon: <FaHeart />, to: "/favorites" },
  { label: "Orders", icon: <FaBox />, to:"/orders" },

];

const menuLinks = [
  { label: "Home", icon: <FiHome size={20} />, to: "/" },
  { label: "Products", icon: <FiGrid size={20} />, to: "/products" },
  { label: "My products", icon: <FiBox size={20} />, to: "/Myproducts" },
  { label: "Favorites", icon: <FiHeart size={20} />, to: "/favorites" },
  { label: "My orders", icon: <FiArchive size={20} />, to: "/orders" },
]

const menuLinks2 = [
  { label: "Contact us", icon: <FiHeadphones size={20} />, to: "/contact-us" },
]

const menuTextLinks = [
  { label: "User agreement", to: "/terms" },
  { label: "Privacy policy", to: "/privacy" },
]

const MyNavBar2 = () => {

  const navigate = useNavigate()
  const [showCart, setShowCart] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { user, logout } = useContext(AuthContext)

  const closeMenu = () => setShowMenu(false)
  const { cartCount } = useCart()
  const { favoritesCount } = useFavorites()

  return (
    <div className="site-header">
      {['lg'].map((expand) => (
        <Navbar key={expand} expand={expand} expanded={showMenu} onToggle={setShowMenu} className="bg-body-tertiary">
          <Container>

                        <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand-${expand}`}
              className="mobile-menu-button"
            />

                        <Navbar.Brand as={Link} to="/"  className="navbar-logo">
              <img src={logo} alt="logo" />
            </Navbar.Brand>

            <div className="d-flex d-lg-none align-items-center gap-4 ms-auto   ">

              <Link className="navbarlinks" to="/favorites">
                <span className="position-relative d-inline-block">
                  <FaHeart size={20} />
                  {favoritesCount > 0 && (
                    <span
                      className="position-absolute badge rounded-pill"
                      style={{ top: -8, right: -12, backgroundColor: '#f0345d' }}
                    >
                      {favoritesCount}
                    </span>
                  )}
                </span>
              </Link>
           <button
              type="button"
              className="navbarlinks border-0 bg-transparent p-0"
              onClick={() => setShowCart(true)}
            >
                  <span className="position-relative d-inline-block">
                    <FaShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span
                        className="position-absolute badge rounded-pill"
                        style={{ top: -8, right: -12, backgroundColor: '#f0345d' }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </span>
            </button>
              <Link  className='navbarlinks'  to="/profile"><FaUserCircle size={22} /></Link>
            </div>

            <div className="d-none d-lg-flex align-items-center gap-4 desktop-icons ms-auto">
               {desktopIconLinks.map((link)=>(
                <IconLink
                key={link.label}
                {...link}
                count={link.to === '/favorites' ? favoritesCount : 0}
                 />
               ))}
                  <button
                    type="button"
                    className="navbarlinks d-flex flex-column align-items-center border-0 bg-transparent"
                    onClick={() => setShowCart(true)}
                  >
                        <span className="position-relative d-inline-block">
                          <FaShoppingCart size={20} />
                          {cartCount > 0 && (
                            <span
                              className="position-absolute badge rounded-pill"
                              style={{ top: -8, right: -12, backgroundColor: '#f0345d' }}
                            >
                              {cartCount}
                            </span>
                          )}
                        </span>
                    <span>My cart</span>
                  </button>
              </div>

                        <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
            >

              <Offcanvas.Header closeButton className="d-lg-none" style={{ background: '#eef2f6', alignItems: 'flex-start' }}>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} as="div">
                  <FaUserCircle size={52} color="#bdc5d1" />

                  <div className="mt-2 fs-6 fw-normal">
                    {user ? (
                      <Link to="/profile" onClick={closeMenu} className="text-decoration-none text-dark">
                        {user.name || 'My profile'}
                      </Link>
                    ) : (
                      <>
                        <Link to="/login" onClick={closeMenu} className="text-decoration-none text-dark">Sign in</Link>
                        {' | '}
                        <Link to="/signup" onClick={closeMenu} className="text-decoration-none text-dark">Register</Link>
                      </>
                    )}
                  </div>
                </Offcanvas.Title>
              </Offcanvas.Header>

              <Offcanvas.Body className="p-0 d-lg-none">
                                <div className="py-2">
                  {menuLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={closeMenu}
                      className="d-flex align-items-center gap-3 px-4 py-2 text-decoration-none text-dark"
                    >
                      <span style={{ color: '#8b96a5' }}>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>

                <hr className="my-1 mx-3" />

                                <div className="py-2">
                  {menuLinks2.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={closeMenu}
                      className="d-flex align-items-center gap-3 px-4 py-2 text-decoration-none text-dark"
                    >
                      <span style={{ color: '#8b96a5' }}>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>

                <hr className="my-1 mx-3" />

                <div className="py-2">
                  {menuTextLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={closeMenu}
                      className="d-block py-2 text-decoration-none text-dark"
                      style={{ paddingLeft: 68 }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                                {user && (
                  <>
                    <hr className="my-1 mx-3" />
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none text-dark px-4 py-3"
                      onClick={() => { logout(); closeMenu(); navigate('/') }}
                    >
                      Log out
                    </button>
                  </>
                )}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}

      <CartOffcanvas show={showCart} onHide={() => setShowCart(false)} />
    </div>
  )
}

export default MyNavBar2