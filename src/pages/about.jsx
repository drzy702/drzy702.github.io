import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const DEFAULT_PARAGRAPHS = [
  `I am a computer science graduate, full-stack developer, and business owner based in Las Vegas. My background combines software development, server administration, database management, and real-world business operations.`,
  `As the owner of ScoopersLV, I manage customer communication, scheduling, route planning, service tracking, billing follow-ups, pricing, and marketing. Running a service-based business has helped me understand how software can solve real operational problems, reduce manual work, and make daily workflows more organized.`,
  `My technical experience includes full-stack web development, database integration, authentication, REST APIs, software security, and user-centered design. I have also gained hands-on experience setting up Linux servers from scratch, including configuring Apache for web hosting, MariaDB for database management, and Postfix for email handling. This has helped me better understand how web applications are deployed, hosted, secured, and maintained outside of a classroom environment.`,
  `I enjoy building practical software that connects technical problem-solving with real business needs. My goal is to continue developing applications, dashboards, and workflow tools that help small businesses manage information, improve efficiency, and operate more smoothly.`,
]

export default function About() {
  const [paragraphs, setParagraphs] = useState(DEFAULT_PARAGRAPHS)

  useEffect(() => {
    return onSnapshot(doc(db, 'pages', 'about'), (snap) => {
      if (!snap.exists()) return
      const p = snap.data().paragraphs
      if (p?.length) setParagraphs(p)
    })
  }, [])

  return (
    <section className="page">
      <p className="page-tag">About</p>

      <h1 className="page-title">
        About<br />
        <em>Me</em>
      </h1>

      <div className="page-divider" />

      <div className="page-body">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  )
}
