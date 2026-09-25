
import { useEffect, useRef, useState } from 'react'
import './About.css'
import { useSiteContent } from '../SiteContent'

export default function About() {
  const { about } = useSiteContent()
  const [isVisible, setIsVisible] = useState(false)
  const aboutRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (aboutRef.current) observer.observe(aboutRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={aboutRef} className={`about ${isVisible? 'visible' : ''}`}>
      <div className="about-container">

        <div className="about-image-box">
          <div className="about-bg-shape"></div>
          <div className="about-glow"></div>
          <img src={about.photo} alt={about.title} className="about-img" />
        </div>

        <div className="about-content">
          <p className="about-label">{about.label}</p>
          <h2 className="about-title">{about.title}</h2>

          {about.paragraphs.map((paragraph, index) => <p className="about-text" key={index}>{paragraph}</p>)}

          <div className="about-skills">
            {about.skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>

          <div className="about-stats">
            {about.stats.map((stat, index) => <div className="stat-item" key={index}><h4>{stat.value}</h4><p>{stat.label}</p></div>)}
          </div>

          <div className="about-cta">
            <a href="#contact" className="about-btn primary">{about.primaryButton}</a>
            <a href="#projects" className="about-btn secondary">{about.secondaryButton}</a>
          </div>
        </div>

      </div>
    </section>
  )
}
