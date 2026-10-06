import './Hero.css'
import { contentAssetUrl } from '../api'
import { useSiteContent } from '../SiteContent'

function SocialIcon({ label }: { label: string }) {
  const normalizedLabel = label.toLowerCase()

  if (normalizedLabel.includes('github')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon">
        <path d="M12 2C6.48 2 2 6.57 2 12.24c0 4.49 2.87 8.29 6.84 9.64.5.1.68-.22.68-.49v-1.7c-2.78.61-3.36-1.32-3.36-1.32-.46-1.16-1.12-1.47-1.12-1.47-.92-.63.07-.62.07-.62 1.01.07 1.54 1.04 1.54 1.04.9 1.55 2.35 1.1 2.92.84.09-.66.35-1.1.64-1.35-2.22-.25-4.56-1.1-4.56-4.9 0-1.08.39-1.97 1.03-2.66-.1-.25-.45-1.29.1-2.68 0 0 .85-.27 2.78 1.03A9.73 9.73 0 0 1 12 6.88a9.73 9.73 0 0 1 2.53.34c1.93-1.3 2.78-1.03 2.78-1.03.55 1.39.2 2.43.1 2.68.64.69 1.03 1.58 1.03 2.66 0 3.81-2.35 4.64-4.58 4.89.36.31.68.92.68 1.86v2.76c0 .27.18.6.69.49A10.23 10.23 0 0 0 22 12.24C22 6.57 17.52 2 12 2Z" />
      </svg>
    )
  }

  if (normalizedLabel.includes('linkedin')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon">
        <path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.38a1.56 1.56 0 0 1 0 3.12ZM5.5 9.75h2.9V18H5.5V9.75Zm4.88 0h2.78v1.13h.04c.39-.74 1.34-1.52 2.76-1.52 2.95 0 3.5 1.94 3.5 4.47V18h-2.9v-16.8c0-1.16-.02-2.66-1.63-2.66-1.63 0-1.88 1.27-1.88 2.58V18h-2.9V9.75Z" />
      </svg>
    )
  }

  if (normalizedLabel.includes('twitter') || normalizedLabel.includes('x')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon">
        <path d="M18.9 2h3.56l-7.78 8.9 9.16 11.1h-7.18l-5.6-7.14-6.4 7.14H.4l7.82-8.94L.12 2h7.37l5.06 6.73L18.9 2Zm-1.25 17.7h1.97L7.12 3.23H5.07l12.58 16.47Z" />
      </svg>
    )
  }

  if (normalizedLabel.includes('instagram')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.1-3.1a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
      </svg>
    )
  }

  if (normalizedLabel.includes('facebook')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon">
        <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V7.4c0-.9.3-1.5 1.6-1.5H17V3.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.3v2.5H8v3.1h2.6v8h2.9Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
    </svg>
  )
}

export default function Hero() {
  const { hero } = useSiteContent()
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="about-image-box1">
          <div className="about-bg-shape1" />
          <div className="about-glow1" />
          <img src={contentAssetUrl(hero.photo)} alt={hero.name} className="about-img1" />
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
            {hero.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
              >
                <SocialIcon label={social.label} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
