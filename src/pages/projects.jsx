import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import './projects.css'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjects(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSelected(null) }
    if (selected) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected])

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
          <article
            key={project.id}
            className="project-card"
            onClick={() => setSelected(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelected(project)}
          >
            <div className="project-header">
              <h2 className="project-title">{project.title}</h2>
              <div className="project-tags">
                {project.tags?.map((tag) => (
                  <span key={tag} className="tech-tag">{tag}</span>
                ))}
              </div>
            </div>

            <p className="project-desc">{project.description}</p>

            <div className="enhancements">
              {project.enhancements?.map((e) => (
                <span key={e} className="enhancement-badge">{e}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close">✕</button>

            <p className="modal-tag">{selected.details?.status}</p>
            <h2 className="modal-title">{selected.title}</h2>

            <div className="modal-meta">
              <span className="modal-role">{selected.details?.role}</span>
              <div className="project-tags">
                {selected.tags?.map((tag) => (
                  <span key={tag} className="tech-tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="modal-divider" />

            <p className="modal-overview">{selected.details?.overview}</p>

            <div className="modal-divider" />

            <p className="modal-section-label">Key Features</p>
            <ul className="modal-highlights">
              {selected.details?.highlights?.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            <div className="enhancements" style={{ marginTop: '1.5rem' }}>
              {selected.enhancements?.map((e) => (
                <span key={e} className="enhancement-badge">{e}</span>
              ))}
            </div>

            {selected.githubUrl && (
              <a
                href={selected.githubUrl}
                className="modal-github"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub →
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

