
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
    title: 'NigaJobs',
    description: 'A full-stack job board platform connecting employers and job seekers in Nigeria. Features include job posting, applicant tracking, company profiles, AI matching, and responsive employer + job seeker dashboards.',
    image: '/poject.png',// fixed typo from 'poject.png'
    tags: ['React', 'PHP', 'MySQL', 'Tailwind', 'REST API'],
    github: 'https://github.com/yourusername/nigajobs', // update this
    demo: 'https://nigajobs.com' // put your live link here
  },
  {
    title: 'Log-X Hotel',
    description: 'A modern hotel booking website with room listings, date picker, booking flow, and admin dashboard. Built for a smooth mobile-first experience with clean UI and fast performance.',
    image: '/Hotel.png',
    tags: ['React', 'Vite', 'Tailwind', 'Framer Motion', 'Firebase'],
    github: 'https://github.com/yourusername/log-x-hotel', // update this
    demo: '#' // add live demo link when ready
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
