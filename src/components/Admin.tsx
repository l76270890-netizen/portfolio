import { useState, useEffect } from 'react'
import { db, auth } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import './Admin.css'

type Skill = { name: string; level: number }
type Project = { title: string; description: string; image: string; tags: string[]; github: string; demo: string }

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [name, setName] = useState('Lawrence Ifeanyi')
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  // Check if logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => setUser(user))
  }, [])

  // Load data from Firestore
  useEffect(() => {
    if(user) {
      getDoc(doc(db, "portfolio", "main")).then(snap => {
        if(snap.exists()) {
          const data = snap.data()
          setName(data.name || '')
          setSkills(data.skills || [])
          setProjects(data.projects || [])
        }
      })
    }
  }, [user])

  const login = async () => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch { alert('Wrong email or password') }
    setLoading(false)
  }

  const save = async () => {
    setLoading(true)
    await setDoc(doc(db, "portfolio", "main"), { name, skills, projects })
    setLoading(false)
    alert('Saved! Your portfolio is now live')
  }

  const addSkill = () => setSkills([...skills, { name: '', level: 80 }])
  const updateSkill = (i: number, field: keyof Skill, value: any) => {
    const newSkills = [...skills]; newSkills[i][field] = value; setSkills(newSkills)
  }
  const deleteSkill = (i: number) => setSkills(skills.filter((_, idx) => idx!== i))

  const addProject = () => setProjects([...projects, { title: '', description: '', image: '', tags: [], github: '', demo: '' }])
  const updateProject = (i: number, field: keyof Project, value: any) => {
    const newProjects = [...projects]; newProjects[i][field] = value; setProjects(newProjects)
  }
  const deleteProject = (i: number) => setProjects(projects.filter((_, idx) => idx!== i))

  if(!user) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={login} disabled={loading}>{loading? 'Logging in...' : 'Login'}</button>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Portfolio Admin</h1>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>

      <button className="save-btn" onClick={save} disabled={loading}>
        {loading? 'Saving...' : 'Save All Changes'}
      </button>

      <section>
        <h3>Change Name</h3>
        <input value={name} onChange={e => setName(e.target.value)} />
      </section>

      <section>
        <h3>Skills</h3>
        <button onClick={addSkill}>+ Add Skill</button>
        {skills.map((skill, i) => (
          <div key={i} className="admin-item">
            <input placeholder="Skill Name" value={skill.name} onChange={e => updateSkill(i, 'name', e.target.value)} />
            <input type="number" placeholder="Level 0-100" value={skill.level} onChange={e => updateSkill(i, 'level', Number(e.target.value))} />
            <button className="delete" onClick={() => deleteSkill(i)}>Delete</button>
          </div>
        ))}
      </section>

      <section>
        <h3>Projects</h3>
        <button onClick={addProject}>+ Add Project</button>
        {projects.map((p, i) => (
          <div key={i} className="admin-item project">
            <input placeholder="Title" value={p.title} onChange={e => updateProject(i, 'title', e.target.value)} />
            <textarea placeholder="Description" value={p.description} onChange={e => updateProject(i, 'description', e.target.value)} />
            <input placeholder="Image URL" value={p.image} onChange={e => updateProject(i, 'image', e.target.value)} />
            <input placeholder="Tags: React, PHP" value={p.tags.join(', ')} onChange={e => updateProject(i, 'tags', e.target.value.split(', ').filter(Boolean))} />
            <input placeholder="GitHub Link" value={p.github} onChange={e => updateProject(i, 'github', e.target.value)} />
            <input placeholder="Demo Link" value={p.demo} onChange={e => updateProject(i, 'demo', e.target.value)} />
            <button className="delete" onClick={() => deleteProject(i)}>Delete</button>
          </div>
        ))}
      </section>
    </div>
  )
}