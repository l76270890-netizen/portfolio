import './Hero.css'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        
        <div className="hero-text">
          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-name">Lawrence Ifeanyi</h1>
          <h2 className="hero-role">And I'm a <span>Frontend Developer</span></h2>
          <p className="hero-desc">
            Hi! I'm Lawrence, a passionate Frontend Developer specializing in building 
            responsive websites and interactive web experiences using HTML, CSS, React, and PHP.
          </p>
          <div className="hero-buttons">
           <div className="btn">
             <a href="#contact" className="btn-primary1">Hire Me</a>
             <a href="#contact" className="btn-primary2">Contact Me</a>
           </div>
            <div className="socials">
              <a href="#">G</a>
            
              <a href="#">F</a>
              <a href="#">T</a>
              <a href="#">F</a>
              <a href="#">I</a>
            </div>
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-glow"></div>
          <img src="/download.png" alt="Lawrence Ifeanyi" className="hero-image" />
        </div>

      </div>
    </section>
  )
}