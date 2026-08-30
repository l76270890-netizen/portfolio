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

  const handleLinkClick = () => setOpen(false)

  useEffect(() => {
    document.body.style.overflow = open? 'hidden' : 'auto'
  }, [open])

  return (
    <nav>
      <div className="nav-container">
        <a className="logo" href="#home"><span className='span'>Lawrence</span> Ifeanyi</a>

        {/* HAMBURGER still controls open/close */}
        <button className={`menu-toggle ${open? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="Toggle Menu">
         <span></span><span></span><span></span>
        </button>

        <div className={`overlay ${open? 'show' : ''}`} onClick={() => setOpen(false)}></div>

        {/* DRAWER - NO X BUTTON */}
        <div className={`nav-links ${open? 'is-open' : ''}`}>
          <div className="drawer-header">
            <a className="logo" href="#home"><span className='span'>Lawrence</span> Ifeanyi</a>
            {/* X button removed */}
          </div>

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

          <div className="drawer-footer">
            <p>Available for work</p>
          </div>
        </div>
      </div>
    </nav>
  )
}