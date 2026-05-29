import { NavLink } from 'react-router-dom'
import './Navbar.css'

const links = [
  { to: '/', label: 'home' },
  { to: '/about', label: 'about' },
  { to: '/projects', label: 'projects' },
  { to: '/resume', label: 'resume' },
]

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        <span className="logo-initials">QDN</span>
        <span className="logo-sep">&nbsp;/&nbsp;</span>
        <span className="logo-label">portfolio</span>
      </NavLink>

      <ul className="navbar-links">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
