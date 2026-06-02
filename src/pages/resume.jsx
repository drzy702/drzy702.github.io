import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import './resume.css'

const DEFAULT_SKILLS = [
  { category: 'Frontend', items: ['Angular', 'HTML', 'CSS', 'JavaScript'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'REST APIs'] },
  { category: 'Database', items: ['MongoDB', 'Mongoose', 'NoSQL'] },
  { category: 'Security', items: ['JWT', 'Authentication', 'Authorization'] },
]

const DEFAULT_EDUCATION = [
  { title: 'B.S. Computer Science', date: 'In Progress', institution: 'Southern New Hampshire University' },
]

export default function Resume() {
  const [skills, setSkills] = useState(DEFAULT_SKILLS)
  const [education, setEducation] = useState(DEFAULT_EDUCATION)

  useEffect(() => {
    return onSnapshot(doc(db, 'pages', 'resume'), (snap) => {
      if (!snap.exists()) return
      const d = snap.data()
      if (d.skills?.length) setSkills(d.skills)
      if (d.education?.length) setEducation(d.education)
    })
  }, [])

  return (
    <section className="page">
      <p className="page-tag">Resume</p>

      <h1 className="page-title">
        Quang Drazy<br />
        <em>Nguyen</em>
      </h1>

      <div className="page-divider" />

      <div className="resume-section">
        <h2 className="resume-section-title">Skills</h2>
        <div className="skills-grid">
          {skills.map(({ category, items }) => (
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

      <div className="resume-section">
        <h2 className="resume-section-title">Education</h2>
        {education.map((e, i) => (
          <div key={i} className="resume-entry">
            <div className="resume-entry-head">
              <span className="resume-entry-title">{e.title}</span>
              <span className="resume-entry-date mono muted">{e.date}</span>
            </div>
            <p className="resume-entry-sub muted">{e.institution}</p>
          </div>
        ))}
      </div>

      <div className="page-divider" />

      <a href="/resume.pdf" className="resume-download" download>
        Download PDF Resume →
      </a>
    </section>
  )
}
