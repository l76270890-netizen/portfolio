import './Hero.css'
import { useSiteContent } from '../SiteContent'

export default function Hero() {
  const { hero } = useSiteContent()
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="about-image-box1">
          <div className="about-bg-shape1" />
          <div className="about-glow1" />
          <img src={hero.photo} alt={hero.name} className="about-img1" />
        </div>
        <div className="hero-text">
          <p className="hero-greeting">{hero.greeting}</p>
          <h1 className="hero-name">{hero.name}</h1>
          <h2 className="hero-role">{hero.rolePrefix} <span>{hero.role}</span></h2>
          <p className="hero-desc">{hero.description}</p>
          <div className="hero-buttons"><div className="btn">
            <a href="#contact" className="btn-primary1">{hero.primaryButton}</a>
            <a href="#contact" className="btn-primary2">{hero.secondaryButton}</a>
          </div></div>
          <div className="socials">
            {hero.socials.map((social) => <a key={social.label} href={social.url} target="_blank" rel="noreferrer" aria-label={social.label} title={social.label}>{social.label.slice(0, 1)}</a>)}
          </div>
        </div>
      </div>
    </section>
  )
}
