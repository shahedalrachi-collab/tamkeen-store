
import { NavLink }from 'react-router'

  const NavlinkItem = ({icon, label, to ,  className = "" } ) => {
  return (

    <NavLink to={to} className={`d-flex align-items-center text-decoration-none  navbarlinks  ${className}`}>
      {icon}
     {label}
    </NavLink>
  )
}

export default NavlinkItem