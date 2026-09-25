import { useState, useEffect } from 'react'
import './Navbar.css'
import { useSiteContent } from '../SiteContent'

export default function Navbar() {
  const { navigation } = useSiteContent()
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
        <a className="logo" href="#home"><span className='span'>{navigation.brandFirst}</span> {navigation.brandLast}</a>

        {/* HAMBURGER still controls open/close */}
        <button className={`menu-toggle ${open? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="Toggle Menu">
         <span></span><span></span><span></span>
        </button>

        <div className={`overlay ${open? 'show' : ''}`} onClick={() => setOpen(false)}></div>

        {/* DRAWER - NO X BUTTON */}
        <div className={`nav-links ${open? 'is-open' : ''}`}>
          <div className="drawer-header">
            <a className="logo" href="#home"><span className='span'>{navigation.brandFirst}</span> {navigation.brandLast}</a>
            {/* X button removed */}
          </div>

          <ul>
            {navigation.links.map(({ label, target }) => (
              <li key={target}>
                <a
                  href={`#${target}`}
                  className={active===target? 'active' : ''}
                  onClick={handleLinkClick}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="drawer-footer">
            <p>{navigation.availability}</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
