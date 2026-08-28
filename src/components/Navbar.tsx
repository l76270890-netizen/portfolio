import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) setActive(entry.target.id)
      })
    }, { threshold: 0.3 })
    sections.forEach(s => observer.observe(s))
  }, [])

  // close drawer when clicking a link
  const handleLinkClick = () => setOpen(false)

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open? 'hidden' : 'auto'
  }, [open])

  return (
    <nav>
      <div className="nav-container">
        <a className="logo" href="#home"><span className='span'>Lawrence</span> Ifeanyi</a>

        {/* HAMBURGER */}
        <button className={`menu-toggle ${open? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="Toggle Menu">
          <span></span><span></span><span></span>
        </button>

        {/* OVERLAY */}
        <div className={`overlay ${open? 'show' : ''}`} onClick={() => setOpen(false)}></div>

        {/* DRAWER */}
        <div className={`nav-links ${open? 'is-open' : ''}`}>
          <ul>
            {['home','about','services','Skills','projects','contact'].map(id => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={active===id? 'active' : ''}
                  onClick={handleLinkClick}
                >
                  {id.charAt(0).toUpperCase()+id.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}