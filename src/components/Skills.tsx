import { useState } from 'react'
import './Skills.css'
import { useSiteContent } from '../SiteContent'

export default function Skills(){
  const { skills } = useSiteContent()
  const [note, setNote] = useState(skills.instruction)

  return (
    <section className="skills" id="Skills">
      <p className="section-label">{skills.label}</p>
      <h2 className="reveal is-visible">{skills.title}</h2>
      <div className="skills-container">
        {skills.items.map(s => (
          <div key={s.name} className="skill reveal is-visible" onMouseEnter={() => setNote(s.note)} onClick={() => setNote(s.note)}>
            {s.name}
          </div>
        ))}
      </div>
      <p className="skill-note reveal is-visible">{note}</p>
    </section>
  )
}
