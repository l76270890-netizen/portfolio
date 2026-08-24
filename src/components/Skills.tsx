import { useState } from 'react'
import './Skills.css'

const skills = [
  { name: 'HTML', note: 'HTML gives me the structure for accessible and well-organized interfaces.' },
  { name: 'PHP', note: 'PHP helps me work with dynamic website features and server-side logic.' },
  { name: 'CSS', note: 'CSS is where I shape layouts, motion, spacing, and brand personality.' },
  { name: 'Ruby', note: 'Ruby expands the way I think about logic, readability, and backend workflows.' },
  { name: 'JS', note: 'JavaScript brings my interfaces to life with interaction and dynamic behavior.' },
  { name: 'Solidity', note: 'Solidity reflects my interest in emerging technologies and blockchain products.' },
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