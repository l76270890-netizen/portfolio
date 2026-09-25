import { useEffect, useState } from 'react'
import type { PortfolioContent } from '../content'
import './Admin.css'

type Message = { id: string; name: string; email: string; phone: string; message: string; createdAt: string }
type Value = string | number | boolean | null | Value[] | { [key: string]: Value }

function emptyArrayItem(path: (string | number)[]): Value {
  const name = path.join('.')
  if (name.endsWith('navigation.links')) return { label: '', target: '' }
  if (name.endsWith('hero.socials')) return { label: '', url: '' }
  if (name.endsWith('about.stats')) return { value: '', label: '' }
  if (name.endsWith('services.items')) return { id: '', title: '', description: '' }
  if (name.endsWith('skills.items')) return { name: '', note: '' }
  if (name.endsWith('projects.items')) return { title: '', description: '', image: '', tags: [], github: '', demo: '' }
  return ''
}

function blankLike(value: Value): Value {
  if (Array.isArray(value)) return []
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).map((key) => [key, blankLike(value[key])]))
  if (typeof value === 'number') return 0
  if (typeof value === 'boolean') return false
  return ''
}

function updateAt(value: Value, path: (string | number)[], next: Value): Value {
  if (!path.length) return next
  const [key, ...rest] = path
  if (Array.isArray(value)) return value.map((item, index) => index === key ? updateAt(item, rest, next) : item)
  if (value && typeof value === 'object') return { ...value, [key]: updateAt(value[key as string], rest, next) }
  return value
}

function removeAt(value: Value, path: (string | number)[]): Value {
  if (!path.length) return value
  const [key, ...rest] = path
  if (Array.isArray(value) && !rest.length) return value.filter((_, index) => index !== key)
  if (Array.isArray(value)) return value.map((item, index) => index === key ? removeAt(item, rest) : item)
  if (value && typeof value === 'object') return { ...value, [key]: removeAt(value[key as string], rest) }
  return value
}

function prettyLabel(value: string) {
  return value.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/^./, (letter) => letter.toUpperCase())
}

function ContentEditor({ value, path, onChange, onUpload }: { value: Value; path: (string | number)[]; onChange: (path: (string | number)[], next: Value) => void; onUpload: (path: (string | number)[], file: File) => Promise<void> }) {
  const label = String(path[path.length - 1] ?? 'Content')
  if (Array.isArray(value)) return <fieldset className="admin-list">
    <legend>{prettyLabel(label)}</legend>
    {value.map((item, index) => <div className="admin-list-item" key={index}>
      <ContentEditor value={item} path={[...path, index]} onChange={onChange} onUpload={onUpload} />
      <button type="button" className="admin-remove" onClick={() => onChange(path, removeAt(value, [index]))}>Remove</button>
    </div>)}
    <button type="button" className="admin-add" onClick={() => onChange(path, [...value, value.length ? blankLike(value[0]) : emptyArrayItem(path)])}>Add {prettyLabel(label.replace(/s$/, ''))}</button>
  </fieldset>
  if (value && typeof value === 'object') return <fieldset className="admin-object">
    <legend>{prettyLabel(label)}</legend>
    <div className="admin-fields">{Object.entries(value).map(([key, child]) => <ContentEditor key={key} value={child} path={[...path, key]} onChange={onChange} onUpload={onUpload} />)}</div>
  </fieldset>
  const stringValue = String(value ?? '')
  const multiline = stringValue.length > 90 || /description|paragraph|note|subtitle|instruction/i.test(label)
  return <label className="admin-field">
    <span>{prettyLabel(label)}</span>
    {multiline ? <textarea value={stringValue} onChange={(event) => onChange(path, event.target.value)} rows={3} /> : <input value={stringValue} onChange={(event) => onChange(path, typeof value === 'number' ? Number(event.target.value) : event.target.value)} />}
    {/^(photo|image)$/i.test(label) && <span className="admin-upload">Upload image <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onUpload(path, file); event.target.value = '' }} /></span>}
  </label>
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('portfolio-admin-token') || '')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState<PortfolioContent | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [active, setActive] = useState('navigation')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadContent(authToken = token) {
    const response = await fetch('/api/admin/content', { headers: { Authorization: `Bearer ${authToken}` } })
    if (response.status === 401) { setToken(''); sessionStorage.removeItem('portfolio-admin-token'); return }
    if (!response.ok) throw new Error('Could not load portfolio content.')
    setContent(await response.json())
  }

  async function loadMessages(authToken = token) {
    const response = await fetch('/api/admin/messages', { headers: { Authorization: `Bearer ${authToken}` } })
    if (response.ok) setMessages(await response.json())
  }

  useEffect(() => { if (token) { loadContent().catch((error) => setNotice(error.message)); loadMessages() } }, [token])

  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setNotice('')
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Login failed.')
      sessionStorage.setItem('portfolio-admin-token', data.token); setToken(data.token); setPassword('')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Login failed.') }
    finally { setBusy(false) }
  }

  async function save() {
    if (!content) return
    setBusy(true); setNotice('')
    try {
      const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(content) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not save changes.')
      setContent(data); setNotice('Changes saved. Your portfolio is updated.')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not save changes.') }
    finally { setBusy(false) }
  }

  async function upload(path: (string | number)[], file: File) {
    setBusy(true); setNotice(`Uploading ${file.name}…`)
    try {
      if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type) || file.size > 3 * 1024 * 1024) throw new Error('Choose a PNG, JPG, WEBP, or GIF image under 3 MB.')
      const encoded = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1] || ''); reader.onerror = () => reject(new Error('Could not read this image.')); reader.readAsDataURL(file)
      })
      const response = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ filename: file.name, data: encoded }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Image upload failed.')
      setContent((current) => current ? updateAt(current as unknown as Value, path, result.url) as PortfolioContent : current)
      setNotice('Image uploaded. Save changes to publish it on your portfolio.')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Image upload failed.') }
    finally { setBusy(false) }
  }

  function logout() { sessionStorage.removeItem('portfolio-admin-token'); setToken(''); setContent(null); setMessages([]) }

  if (!token) return <main className="admin-login-page"><form className="admin-login" onSubmit={login}>
    <a className="admin-back" href="/">← View portfolio</a><p className="admin-eyebrow">PORTFOLIO CONTROL</p><h1>Admin sign in</h1><p>Sign in to edit your portfolio content.</p>
    <label className="admin-field"><span>Admin password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
    {notice && <p className="admin-notice error">{notice}</p>}<button className="admin-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
  </form></main>

  const sections = ['navigation', 'hero', 'about', 'services', 'skills', 'projects', 'contact'] as const
  const sectionValue = content?.[active as keyof PortfolioContent]
  return <main className="admin-page">
    <header className="admin-topbar"><a href="/" className="admin-back">← View portfolio</a><div><strong>Portfolio Admin</strong><button type="button" className="admin-logout" onClick={logout}>Sign out</button></div></header>
    <div className="admin-shell"><aside className="admin-sidebar"><p className="admin-eyebrow">WEBSITE CONTENT</p>{sections.map((section) => <button type="button" className={active === section ? 'selected' : ''} key={section} onClick={() => setActive(section)}>{prettyLabel(section)}</button>)}<button type="button" className={active === 'messages' ? 'selected' : ''} onClick={() => { setActive('messages'); loadMessages() }}>Contact messages <span>{messages.length}</span></button></aside>
      <section className="admin-main"><div className="admin-heading"><div><p className="admin-eyebrow">EDIT YOUR WEBSITE</p><h1>{active === 'messages' ? 'Contact messages' : prettyLabel(active)}</h1><p>Update the content shown on your public portfolio.</p></div>{active !== 'messages' && <button className="admin-primary" onClick={save} disabled={busy || !content}>{busy ? 'Saving…' : 'Save changes'}</button>}</div>
        {notice && <p className="admin-notice">{notice}</p>}
        {active === 'messages' ? <div className="admin-messages">{messages.length ? messages.map((message) => <article key={message.id}><div><strong>{message.name}</strong><time>{new Date(message.createdAt).toLocaleString()}</time></div><p><a href={`mailto:${message.email}`}>{message.email}</a>{message.phone && ` · ${message.phone}`}</p><p>{message.message}</p></article>) : <p>No messages yet.</p>}</div>
          : content && sectionValue !== undefined ? <ContentEditor value={sectionValue as Value} path={[active]} onChange={(path, next) => setContent((current) => current ? updateAt(current as unknown as Value, path, next) as PortfolioContent : current)} onUpload={upload} />
          : <p>Loading content…</p>}
      </section>
    </div>
  </main>
}
