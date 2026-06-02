import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import './home.css'

const DEFAULT_BIO = `Full-stack developer and business owner with experience in web development, database design, Linux server administration, and business operations. I combine my computer science background with hands-on experience running ScoopersLV, managing real workflows, and setting up production-style web environments using Apache, MariaDB, and Postfix.`

const DEFAULT_TAGS = ['Full-Stack Development', 'Business Operations', 'Linux Server Administration',
  'Apache', 'MariaDB', 'Postfix', 'MongoDB', 'Express', 'Angular', 'Node.js', 'JWT', 'REST APIs']

export default function Home() {
  const [bio, setBio] = useState(DEFAULT_BIO)
  const [tags, setTags] = useState(DEFAULT_TAGS)

  useEffect(() => {
    return onSnapshot(doc(db, 'pages', 'home'), (snap) => {
      if (!snap.exists()) return
      const d = snap.data()
      if (d.bio) setBio(d.bio)
      if (d.tags?.length) setTags(d.tags)
    })
  }, [])

  return (
    <section className="home-page">
      <div className="home-inner">
        <p className="page-tag">Portfolio</p>

        <h1 className="home-title">
          Quang Drazy<br />
          <em>Nguyen</em>
        </h1>

        <p className="home-sub">{bio}</p>

        <div className="home-actions">
          <Link to="/projects" className="btn btn-primary">View Projects</Link>
          <Link to="/resume" className="btn btn-ghost">Resume →</Link>
        </div>

        <div className="home-divider" />

        <div className="home-stack">
          {tags.map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
