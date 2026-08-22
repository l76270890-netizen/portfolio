import { useEffect, useRef, useState } from 'react'
import './About.css'

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const aboutRef = useRef<HTMLElement>(null)

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (aboutRef.current) observer.observe(aboutRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={aboutRef} className={`about ${isVisible? 'visible' : ''}`}>
      <div className="about-container">
        
        <div className="about-image-box">
          <div className="about-bg-shape"></div>
          <img src="/b5.jpg" alt="Lawrence Ifeanyi" className="about-img" />
        </div>

        <div className="about-content">
          <p className="about-label">—— ABOUT ME</p>
          <h3 className="about-title">Frontend Developer & UI Enthusiast</h3>
          <p className="about-text">
            I am a passionate Frontend Developer focused on building responsive, user-friendly, 
            and visually appealing websites. I enjoy turning ideas into real-world digital experiences.
          </p>
          <p className="about-text">
            With a strong foundation in HTML, CSS, JavaScript, React, and PHP, I craft clean code 
            and pixel-perfect designs that work seamlessly across all devices.
          </p>

          <div className="about-stats">
            <div className="stat-item">
              <h4>2+</h4>
              <p>Years Experience</p>
            </div>
            <div className="stat-item">
              <h4>15+</h4>
              <p>Projects Completed</p>
            </div>
            <div className="stat-item">
              <h4>100%</h4>
              <p>Client Satisfaction</p>
            </div>
          </div>

          <a href="#contact" className="about-btn">Hire Me</a>
        </div>

      </div>
    </section>
  )
}