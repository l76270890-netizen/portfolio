import './Projects.css'

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <p className="projects-label">—— MY WORK</p>
      <h3 className="projects-title">Featured Projects</h3>
      <div className="projects-grid">
        <div className="project-card">
          <h4>CBT Exam App</h4>
          <p>React + PHP exam system with timer and auto grading.</p>
        </div>
        <div className="project-card">
          <h4>Portfolio Website</h4>
          <p>This portfolio built with React and Vite.</p>
        </div>
      </div>
    </section>
  )
}