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

  return (
    <nav>
      <div className="nav-container">
        <a className="logo" href="#home">My Portfolio</a>
        <button className={`menu-toggle ${open? 'is-open' : ''}`} onClick={() => setOpen(!open)}>
          <span></span><span></span><span></span>
        </button>
        <div className={`nav-links ${open? 'is-open' : ''}`}>
          <ul>
            {['home','about','service','Skills','project','contact'].map(id => (
              <li key={id}><a href={`#${id}`} className={active===id? 'active' : ''}>{id.charAt(0).toUpperCase()+id.slice(1)}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}