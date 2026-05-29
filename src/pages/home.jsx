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
          Full stack developer with a focus on software design, algorithm
          efficiency, and secure database integration. Building with the
          MEAN stack — MongoDB, Express, Angular, Node.js.
        </p>

        <div className="home-actions">
          <Link to="/projects" className="btn btn-primary">View Projects</Link>
          <Link to="/resume" className="btn btn-ghost">Resume →</Link>
        </div>

        <div className="home-divider" />

        <div className="home-stack">
          {['MongoDB', 'Express', 'Angular', 'Node.js', 'JWT', 'REST APIs'].map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
