
import { useEffect, useRef, useState } from 'react'
import './About.css'

export default function About() {
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
          <img src="/hero.jpeg" alt="Lawrence Ifeanyi - Frontend Developer" className="about-img" />
        </div>

        <div className="about-content">
          <p className="about-label">ABOUT ME</p>
          <h2 className="about-title">Frontend Developer building products that people actually use</h2>

          <p className="about-text">
            I'm Lawrence, a Frontend Developer based in Abuja. I specialize in turning complex problems into
            simple, beautiful, and intuitive interfaces.
          </p>
          <p className="about-text">
            Currently building <span className="highlight">NigaJobs</span> — a full-stack job platform for Nigeria,
            and <span className="highlight">Log-X Hotel</span> — a modern booking website. I care about performance,
            accessibility, and clean code that scales.
          </p>

          <div className="about-skills">
            <span>React</span>
            <span>Tailwind</span>
            <span>JavaScript</span>
            <span>PHP</span>
            <span>MySQL</span>
          </div>

          <div className="about-stats">
            <div className="stat-item">
              <h4>2+</h4>
              <p>Years Building</p>
            </div>
            <div className="stat-item">
              <h4>15+</h4>
              <p>Projects Shipped</p>
            </div>
            <div className="stat-item">
              <h4>2</h4>
              <p>Live Products</p>
            </div>
          </div>

          <div className="about-cta">
            <a href="#contact" className="about-btn primary">Hire Me</a>
            <a href="#projects" className="about-btn secondary">View Work</a>
          </div>
        </div>

      </div>
    </section>
  )
}
