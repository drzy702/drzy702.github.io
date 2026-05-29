import './projects.css'

const projects = [
  {
    title: 'Travlr Getaways',
    tags: ['MongoDB', 'Express', 'Angular', 'Node.js'],
    description:
      'Full stack travel booking application with client-side search, filtering, and sorting. Includes JWT authentication and an admin dashboard for managing trips and bookings.',
    enhancements: ['Software Design', 'Algorithms & Data Structures', 'Database Integration'],
  },
]

export default function Projects() {
  return (
    <section className="page">
      <p className="page-tag">Projects</p>

      <h1 className="page-title">
        Selected<br />
        <em>Work</em>
      </h1>

      <div className="page-divider" />

      <div className="projects-list">
        {projects.map((project) => (
          <article key={project.title} className="project-card">
            <div className="project-header">
              <h2 className="project-title">{project.title}</h2>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tech-tag">{tag}</span>
                ))}
              </div>
            </div>

            <p className="project-desc">{project.description}</p>

            <div className="enhancements">
              {project.enhancements.map((e) => (
                <span key={e} className="enhancement-badge">{e}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
