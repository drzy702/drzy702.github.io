import { NavLink, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const clickCount = useRef(0)
  const clickTimer = useRef(null)

  const links = [
    { to: '/', label: 'home' },
    { to: '/about', label: 'about' },
    { to: currentUser ? '/admin' : '/projects', label: 'projects' },
    { to: '/resume', label: 'resume' },
  ]

  function handleLogoClick(e) {
    e.preventDefault()
    clickCount.current += 1
    clearTimeout(clickTimer.current)
    if (clickCount.current >= 5) {
      clickCount.current = 0
      navigate('/login')
      return
    }
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0
      navigate('/')
    }, 2000)
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo" onClick={handleLogoClick}>
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
        {currentUser && (
          <li>
            <button
              className="nav-logout"
              onClick={() => { navigate('/'); logout() }}
            >
              logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}
