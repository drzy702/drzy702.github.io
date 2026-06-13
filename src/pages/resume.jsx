import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import './resume.css'

const DEFAULT_ABOUT = `Computer science graduate, full-stack developer, and business owner based in Las Vegas with experience in web development, server administration, database management, and real-world business operations. As the owner of ScoopersLV, I manage customer communication, scheduling, route planning, billing follow-ups, pricing, and marketing, which has helped me understand how software can improve workflows and solve practical business problems. I have hands-on experience building applications, working with databases, setting up Linux servers, configuring Apache, MariaDB, and Postfix, and developing tools that support small business efficiency.`

const DEFAULT_EXPERIENCE = [
  {
    title: 'ScoopersLV — Owner',
    location: 'Las Vegas, NV',
    date: 'January 2026–Present',
    bullets: [
      'Own and operate a dog waste removal business, managing service routes, customer communication, scheduling, pricing, and billing follow-ups.',
      'Provide hands-on field service for recurring residential clients while maintaining reliable weekly and twice-weekly route schedules.',
      'Handle customer inquiries, quotes, onboarding, service updates, and issue resolution for both new and existing clients.',
      'Organize route details, customer preferences, property access notes, and service frequency to keep daily operations running efficiently.',
      'Built strong experience in customer service, business operations, time management, problem-solving, and client retention.',
    ],
  },
  {
    title: 'Teapresso Bar — Social Media Coordinator',
    location: 'Remote',
    date: 'January 2025–Present',
    bullets: [
      'Managed social media content and digital marketing campaigns for a multi-location beverage brand.',
      'Organized content around business goals such as increasing foot traffic, improving brand visibility, and promoting customer participation.',
      'Applied user-centered thinking to create clear, visually engaging posts for customers across social platforms.',
      'Collaborated on marketing ideas while maintaining consistent branding, messaging, and campaign details.',
    ],
  },
]

const DEFAULT_SKILLS = [
  { category: 'Development', items: ['Full-Stack Web Development', 'Database Management', 'Software Security', 'Web Hosting & Deployment'] },
  { category: 'Business', items: ['Marketing', 'Business Operations', 'Customer Communication', 'Small Business Management'] },
  { category: 'Design', items: ['User-Centered Design', 'Problem Solving'] },
]

const DEFAULT_TOOLS = ['CSS', 'HTML', 'JavaScript', 'PHP', 'SQL', 'Visual Studio Code']

const DEFAULT_EDUCATION = [
  { title: 'B.S. Computer Science', date: 'In Progress', institution: 'Southern New Hampshire University' },
]

export default function Resume() {
  const [about, setAbout] = useState(DEFAULT_ABOUT)
  const [experience, setExperience] = useState(DEFAULT_EXPERIENCE)
  const [skills, setSkills] = useState(DEFAULT_SKILLS)
  const [tools, setTools] = useState(DEFAULT_TOOLS)
  const [education, setEducation] = useState(DEFAULT_EDUCATION)

  useEffect(() => {
    return onSnapshot(doc(db, 'pages', 'resume'), (snap) => {
      if (!snap.exists()) return
      const d = snap.data()
      if (d.about) setAbout(d.about)
      if (d.experience?.length) setExperience(d.experience)
      if (d.skills?.length) setSkills(d.skills)
      if (d.tools?.length) setTools(d.tools)
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
        <h2 className="resume-section-title">About</h2>
        <p className="resume-about">{about}</p>
      </div>

      <div className="page-divider" />

      <div className="resume-section">
        <h2 className="resume-section-title">Work Experience</h2>
        {experience.map((job, i) => (
          <div key={i} className="resume-entry">
            <div className="resume-entry-head">
              <span className="resume-entry-title">{job.title}</span>
              <span className="resume-entry-date mono muted">{job.date}</span>
            </div>
            <p className="resume-entry-sub muted">{job.location}</p>
            <ul className="resume-bullets">
              {job.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

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
        <h2 className="resume-section-title">Tools</h2>
        <div className="skill-items">
          {tools.map((tool) => (
            <span key={tool} className="skill-pill">{tool}</span>
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
