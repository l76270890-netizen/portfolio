import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [feedback, setFeedback] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback('Message sent! I will get back to you soon.')
    setTimeout(() => setFeedback(''), 3000)
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-container reveal is-visible">
        <p className="section-label">Contact Me</p>
        <h2>Let's Build Something Great</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <input type="text" placeholder="First name" required />
            <input type="text" placeholder="Second name" required />
          </div>
          <div className="input-row">
            <input type="tel" placeholder="Phone No." />
            <input type="email" placeholder="Email Address" required />
          </div>
          <textarea placeholder="Your message" required></textarea>
          <button className="btn btn-primary submit-button" type="submit">Get In Touch</button>
          <p className="form-feedback">{feedback}</p>
        </form>
      </div>
    </section>
  )
}