import { useState } from 'react'
import './Contact.css'
import { useSiteContent } from '../SiteContent'

export default function Contact() {
  const { contact } = useSiteContent()
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(formData.entries())) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Message could not be sent.')
      setFeedback('Message sent! I will get back to you soon.')
      form.reset()
    } catch (error) { setFeedback(error instanceof Error ? error.message : 'Message could not be sent. Please try again.') }
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-container reveal is-visible">
        <p className="section-label">{contact.label}</p>
        <h2>{contact.title}</h2>
        {(contact.email || contact.phone) && <p className="contact-details">{contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}{contact.email && contact.phone && ' · '}{contact.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}</p>}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <input name="firstName" type="text" placeholder="First name" required />
            <input name="lastName" type="text" placeholder="Second name" required />
          </div>
          <div className="input-row">
            <input name="phone" type="tel" placeholder="Phone No." />
            <input name="email" type="email" placeholder="Email Address" required />
          </div>
          <textarea name="message" placeholder="Your message" required></textarea>
          <button className="btn btn-primary submit-button" type="submit">{contact.submitLabel}</button>
          <p className="form-feedback">{feedback}</p>
        </form>
      </div>
    </section>
  )
}
