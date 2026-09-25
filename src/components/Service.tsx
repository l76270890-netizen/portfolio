import './Service.css'
import { useSiteContent } from '../SiteContent'

export default function Service(){
  const { services } = useSiteContent()
  return (
    <section id="services" className="service">
      <p className="service-label">{services.label}</p>
      <h3 className="service-title">{services.title}</h3>
      
      <div className="service-grid">
        {services.items.map((item) => (
          <div key={item.id} className="service-card">
            <div className="service-number">{item.id}</div>
            <h4 className="service-card-title">{item.title}</h4>
            <p className="service-card-desc">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
