
import './Projects.css'

type Project = {
  title: string
  description: string
  image: string
  tags: string[]
  github?: string
  demo?: string
}

const projects: Project[] = [
  {
    title: 'Job Board App',
    description: 'A full-stack exam system with timed tests, auto-grading, student dashboard, and admin panel. Built for schools and training centers.',
    image: 'public/poject.png',
    tags: ['React', 'PHP', 'MySQL', 'Tailwind'],
    github: 'https://github.com/yourusername',
    demo: '#'
  },
  {
    title: 'Hotel booking Website',
    description: 'Modern responsive portfolio built with React, Vite, and Framer Motion. Focused on performance, accessibility, and clean UI.',
    image: 'public/Hotel.png',
    tags: ['React', 'Vite', 'CSS', 'Framer Motion'],
    github: 'https://github.com/yourusername',
    demo: '#'
  }
]

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <p className="projects-label">—— MY WORK</p>
        <h2 className="projects-title">Featured Projects</h2>
        <p className="projects-subtitle">
          A selection of projects I’ve built. Each one solves a real problem with clean code and great UX.
        </p>

        <div className="projects-grid">
          {projects.map((project, index) => (
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
