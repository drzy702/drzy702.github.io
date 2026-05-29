import './resume.css'

export default function Resume() {
  return (
    <section className="page">
      <p className="page-tag">Resume</p>

      <h1 className="page-title">
        Quang Drazy<br />
        <em>Nguyen</em>
      </h1>

      <div className="page-divider" />

      {/* Skills */}
      <div className="resume-section">
        <h2 className="resume-section-title">Skills</h2>
        <div className="skills-grid">
          {[
            { category: 'Frontend', items: ['Angular', 'HTML', 'CSS', 'JavaScript'] },
            { category: 'Backend', items: ['Node.js', 'Express', 'REST APIs'] },
            { category: 'Database', items: ['MongoDB', 'Mongoose', 'NoSQL'] },
            { category: 'Security', items: ['JWT', 'Authentication', 'Authorization'] },
          ].map(({ category, items }) => (
            <div key={category} className="skill-group">
              <p className="skill-category">{category}</p>
              <div className="skill-items">
                {items.map((item) => (
                  <span key={item} className="skill-pill">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-divider" />

      {/* Education */}
      <div className="resume-section">
        <h2 className="resume-section-title">Education</h2>
        <div className="resume-entry">
          <div className="resume-entry-head">
            <span className="resume-entry-title">B.S. Computer Science</span>
            <span className="resume-entry-date mono muted">In Progress</span>
          </div>
          <p className="resume-entry-sub muted">Southern New Hampshire University</p>
        </div>
      </div>

      <div className="page-divider" />

      {/* Download CTA */}
      <a
        href="/resume.pdf"
        className="resume-download"
        download
      >
        Download PDF Resume →
      </a>
    </section>
  )
}
