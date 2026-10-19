// import { NavLink }from 'react-router'

// const IconLink = ({ icon, label, to }) => {
//   return (
//     <NavLink to={to} className="icon-link text-decoration-none">

//       <span>{label}</span>
//     </NavLink>

import { NavLink } from 'react-router'

const IconLink = ({ icon, label, to, count = 0 }) => {
  return (
    <NavLink to={to} className="icon-link text-decoration-none">
      <span className="position-relative d-inline-block">
        {icon}
        {count > 0 && (
          <span
            className="position-absolute badge rounded-pill"
            style={{ top: -8, right: -12, backgroundColor: '#f0345d' }}
          >
            {count}
          </span>
        )}
      </span>
      <span>{label}</span>
    </NavLink>
  )
}

export default IconLink