import './Service.css'

const services = [
  {
    id: "01",
    title: "Web Design",
    desc: "Clean, responsive website layouts with strong visual hierarchy and modern styling."
  },
  {
    id: "02", 
    title: "Frontend Development",
    desc: "Interactive interfaces built with HTML, CSS, JavaScript and React for smooth user experiences."
  },
  {
    id: "03",
    title: "React Applications",
    desc: "Modern single page applications with React, reusable components, and clean code."
  },
   {
    id: "04",
    title: "Landing Pages",
    desc: "Conversion-focused pages designed to present products, brands, and offers clearly."
  },
   {
    id: "05",
    title: "UI Styling",
    desc: "Refreshing existing interfaces with better spacing, colors, typography, and consistency."
  },
   {
    id: "06",
    title: "Portfolio Sites",
    desc: "Personal portfolio websites that showcase your skills, personality, and projects beautifully."
  },
  {
    id: "07",
    title: "Website Updates",
    desc: "Improving existing websites with stronger visuals, better responsiveness, and cleaner structure."
  },
 {
    id: "08",
    title: "Job Board Apps ",
    desc: "Modern multipage applications, firebase functionalities with React, reusable components, and clean code."
  },
]

export default function Service(){
  return (
    <section id="services" className="service">
      <p className="service-label">—— MY SERVICES</p>
      <h3 className="service-title">What I Can Build</h3>
      
      <div className="service-grid">
        {services.map((item) => (
          <div key={item.id} className="service-card">
            <div className="service-number">{item.id}</div>
            <h4 className="service-card-title">{item.title}</h4>
            <p className="service-card-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}