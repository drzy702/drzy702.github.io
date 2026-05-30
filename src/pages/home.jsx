import { Link } from 'react-router-dom'
import './home.css'

export default function Home() {
  return (
    <section className="home-page">
      <div className="home-inner">
        <p className="page-tag">Portfolio</p>

        <h1 className="home-title">
          Quang Drazy<br />
          <em>Nguyen</em>
        </h1>

        <p className="home-sub">
           Full-stack developer and business owner with experience in web development, 
           database design, Linux server administration, and business operations. 
           I combine my computer science background with hands-on experience running ScoopersLV, 
           managing real workflows, and setting up production-style web environments using Apache, 
           MariaDB, and Postfix.
        </p>

        <div className="home-actions">
          <Link to="/projects" className="btn btn-primary">View Projects</Link>
          <Link to="/resume" className="btn btn-ghost">Resume →</Link>
        </div>

        <div className="home-divider" />

        <div className="home-stack">
          {['Full-Stack Development', 'Business Operations', 'Linux Server Administration',
            'Apache', 'MariaDB', 'Postfix', 'MongoDB', 'Express', 'Angular', 'Node.js', 'JWT', 'REST APIs'].map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
