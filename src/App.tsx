import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Service from './components/Service'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import './index.css'
import { SiteContentProvider } from './SiteContent'
import Admin from './components/Admin'

export default function App() {
  if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) return <Admin />
  return (
    <SiteContentProvider><>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Service />
        <Skills/>
        <Projects />
        <Contact />
      </main>
    </></SiteContentProvider>
  )
}
