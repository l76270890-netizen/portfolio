
import './Projects.css'
import { useSiteContent } from '../SiteContent'

export default function Projects() {
  const { projects } = useSiteContent()
  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <p className="projects-label">{projects.label}</p>
        <h2 className="projects-title">{projects.title}</h2>
        <p className="projects-subtitle">{projects.subtitle}</p>

        <div className="projects-grid">
          {projects.items.map((project, index) => (
            <div key={index} className="project-card reveal">
              <div className="project-image-wrap">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-links">
                    {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live Demo</a>}
                    {project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>}
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
