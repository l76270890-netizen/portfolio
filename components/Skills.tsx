import { useState } from 'react'
import './Skills.css'


const skills = [
  { name: 'React', note: 'I build dynamic, component-based UIs with React. Used for NigaJobs dashboards and Log-X booking flows.' },
  { name: 'JavaScript', note: 'JavaScript brings my interfaces to life with interaction, state management, and API calls.' },
  { name: 'Tailwind CSS', note: 'Tailwind helps me ship clean, responsive designs fast. All my recent projects use utility-first styling.' },
  { name: 'HTML5', note: 'Semantic HTML for accessible, SEO-friendly structure. Foundation of NigaJobs and Log-X.' },
  { name: 'CSS3', note: 'Custom CSS for animations, layouts, and polishing brand personality beyond Tailwind.' },
  { name: 'PHP', note: 'Server-side logic and REST APIs. Powers the backend for NigaJobs job posting and applications.' },
  { name: 'MySQL', note: 'Database design for users, jobs, bookings, and applications. Optimized queries for performance.' },
  { name: 'Vite', note: 'Fast build tool for React projects. Keeps Log-X and my portfolio running smooth.' },
]

export default function Skills(){
  const [note, setNote] = useState('Click or hover on a skill to see what it adds to my work.')

  return (
    <section className="skills" id="Skills">
      <p className="section-label">—— My Skills</p>
      <h2 className="reveal is-visible">Tools I Use</h2>
      <div className="skills-container">
        {skills.map(s => (
          <div key={s.name} className="skill reveal is-visible" onMouseEnter={() => setNote(s.note)}>
            {s.name}
          </div>
        ))}
      </div>
      <p className="skill-note reveal is-visible">{note}</p>
    </section>
  )
}