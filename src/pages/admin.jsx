import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  collection, doc, onSnapshot, addDoc, updateDoc,
  deleteDoc, setDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import './admin.css'

const emptyForm = {
  title: '', tags: '', description: '', enhancements: '',
  githubUrl: '', overview: '', highlights: '', role: '', status: '',
}

const DEFAULT_BIO = `Full-stack developer and business owner with experience in web development, database design, Linux server administration, and business operations. I combine my computer science background with hands-on experience running ScoopersLV, managing real workflows, and setting up production-style web environments using Apache, MariaDB, and Postfix.`

const DEFAULT_TAGS = 'Full-Stack Development, Business Operations, Linux Server Administration, Apache, MariaDB, Postfix, MongoDB, Express, Angular, Node.js, JWT, REST APIs'

const DEFAULT_PARAGRAPHS = [
  `I am a computer science graduate, full-stack developer, and business owner based in Las Vegas. My background combines software development, server administration, database management, and real-world business operations.`,
  `As the owner of ScoopersLV, I manage customer communication, scheduling, route planning, service tracking, billing follow-ups, pricing, and marketing. Running a service-based business has helped me understand how software can solve real operational problems, reduce manual work, and make daily workflows more organized.`,
  `My technical experience includes full-stack web development, database integration, authentication, REST APIs, software security, and user-centered design. I have also gained hands-on experience setting up Linux servers from scratch, including configuring Apache for web hosting, MariaDB for database management, and Postfix for email handling. This has helped me better understand how web applications are deployed, hosted, secured, and maintained outside of a classroom environment.`,
  `I enjoy building practical software that connects technical problem-solving with real business needs. My goal is to continue developing applications, dashboards, and workflow tools that help small businesses manage information, improve efficiency, and operate more smoothly.`,
]

const DEFAULT_SKILLS = [
  { category: 'Frontend', items: 'Angular, HTML, CSS, JavaScript' },
  { category: 'Backend', items: 'Node.js, Express, REST APIs' },
  { category: 'Database', items: 'MongoDB, Mongoose, NoSQL' },
  { category: 'Security', items: 'JWT, Authentication, Authorization' },
]

const DEFAULT_EDUCATION = [
  { title: 'B.S. Computer Science', date: 'In Progress', institution: 'Southern New Hampshire University' },
]

export default function Admin() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('projects')

  // Projects
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Home
  const [homeBio, setHomeBio] = useState(DEFAULT_BIO)
  const [homeTags, setHomeTags] = useState(DEFAULT_TAGS)
  const [savingHome, setSavingHome] = useState(false)

  // About
  const [paragraphs, setParagraphs] = useState(DEFAULT_PARAGRAPHS)
  const [savingAbout, setSavingAbout] = useState(false)

  // Resume
  const [skills, setSkills] = useState(DEFAULT_SKILLS)
  const [education, setEducation] = useState(DEFAULT_EDUCATION)
  const [savingResume, setSavingResume] = useState(false)

  useEffect(() => {
    return onSnapshot(collection(db, 'projects'), (snap) =>
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [])

  useEffect(() => {
    return onSnapshot(doc(db, 'pages', 'home'), (snap) => {
      if (!snap.exists()) return
      const d = snap.data()
      setHomeBio(d.bio ?? DEFAULT_BIO)
      setHomeTags((d.tags ?? []).join(', '))
    })
  }, [])

  useEffect(() => {
    return onSnapshot(doc(db, 'pages', 'about'), (snap) => {
      if (!snap.exists()) return
      setParagraphs(snap.data().paragraphs ?? DEFAULT_PARAGRAPHS)
    })
  }, [])

  useEffect(() => {
    return onSnapshot(doc(db, 'pages', 'resume'), (snap) => {
      if (!snap.exists()) return
      const d = snap.data()
      if (d.skills) setSkills(d.skills.map((s) => ({ category: s.category, items: s.items.join(', ') })))
      if (d.education) setEducation(d.education)
    })
  }, [])

  function handleLogout() {
    navigate('/')
    logout()
  }

  // ── Project handlers ────────────────────────────

  function handleEdit(project) {
    setForm({
      title: project.title,
      tags: project.tags.join(', '),
      description: project.description,
      enhancements: project.enhancements.join(', '),
      githubUrl: project.githubUrl || '',
      overview: project.details.overview,
      highlights: project.details.highlights.join('\n'),
      role: project.details.role,
      status: project.details.status,
    })
    setEditingId(project.id)
    setShowForm(true)
  }

  function handleCancel() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return
    await deleteDoc(doc(db, 'projects', id))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const data = {
      title: form.title,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      description: form.description,
      enhancements: form.enhancements.split(',').map((t) => t.trim()).filter(Boolean),
      githubUrl: form.githubUrl,
      details: {
        overview: form.overview,
        highlights: form.highlights.split('\n').map((t) => t.trim()).filter(Boolean),
        role: form.role,
        status: form.status,
      },
    }
    try {
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), data)
      } else {
        await addDoc(collection(db, 'projects'), { ...data, createdAt: serverTimestamp() })
      }
      handleCancel()
    } finally {
      setSaving(false)
    }
  }

  // ── Page save handlers ──────────────────────────

  async function saveHome() {
    setSavingHome(true)
    try {
      await setDoc(doc(db, 'pages', 'home'), {
        bio: homeBio,
        tags: homeTags.split(',').map((t) => t.trim()).filter(Boolean),
      })
    } finally {
      setSavingHome(false)
    }
  }

  async function saveAbout() {
    setSavingAbout(true)
    try {
      await setDoc(doc(db, 'pages', 'about'), {
        paragraphs: paragraphs.filter((p) => p.trim()),
      })
    } finally {
      setSavingAbout(false)
    }
  }

  async function saveResume() {
    setSavingResume(true)
    try {
      await setDoc(doc(db, 'pages', 'resume'), {
        skills: skills.map((s) => ({
          category: s.category,
          items: s.items.split(',').map((i) => i.trim()).filter(Boolean),
        })),
        education,
      })
    } finally {
      setSavingResume(false)
    }
  }

  // ── Skill helpers ───────────────────────────────

  function updateSkill(i, field, value) {
    const next = [...skills]
    next[i] = { ...next[i], [field]: value }
    setSkills(next)
  }

  function removeSkill(i) {
    setSkills(skills.filter((_, j) => j !== i))
  }

  // ── Education helpers ───────────────────────────

  function updateEdu(i, field, value) {
    const next = [...education]
    next[i] = { ...next[i], [field]: value }
    setEducation(next)
  }

  function removeEdu(i) {
    setEducation(education.filter((_, j) => j !== i))
  }

  // ── Render ──────────────────────────────────────

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-tag">Admin</p>
          <h1 className="admin-title">Dashboard</h1>
        </div>
        <div className="admin-header-actions">
          {activeTab === 'projects' && !showForm && (
            <button className="btn-admin-add" onClick={() => setShowForm(true)}>+ Add Project</button>
          )}
          <button className="btn-admin-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        {['projects', 'home', 'about', 'resume'].map((tab) => (
          <button
            key={tab}
            className={`admin-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="admin-divider" />

      {/* ── Projects tab ── */}
      {activeTab === 'projects' && (
        <>
          {showForm && (
            <form className="admin-form" onSubmit={handleSubmit}>
              <p className="admin-form-title">{editingId ? 'Edit Project' : 'New Project'}</p>
              <div className="admin-fields">
                <div className="admin-field">
                  <label>Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="admin-field">
                  <label>Tags <span>(comma separated)</span></label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="MongoDB, Express, Node.js" />
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
                </div>
                <div className="admin-field">
                  <label>Enhancements <span>(comma separated)</span></label>
                  <input value={form.enhancements} onChange={(e) => setForm({ ...form, enhancements: e.target.value })} placeholder="Software Design, Algorithms" />
                </div>
                <div className="admin-field">
                  <label>GitHub URL</label>
                  <input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." />
                </div>
                <div className="admin-field">
                  <label>Overview</label>
                  <textarea value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} rows={4} required />
                </div>
                <div className="admin-field">
                  <label>Key Features <span>(one per line)</span></label>
                  <textarea value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} rows={5} placeholder="Built a REST API&#10;Implemented JWT auth" />
                </div>
                <div className="admin-field">
                  <label>Role</label>
                  <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Full Stack Developer" />
                </div>
                <div className="admin-field">
                  <label>Status</label>
                  <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="Personal Project" />
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="btn-admin-save" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Project'}
                </button>
                <button type="button" className="btn-admin-cancel" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          )}

          <div className="admin-list">
            {projects.length === 0 && !showForm && (
              <p className="admin-empty">No projects yet. Click "Add Project" to get started.</p>
            )}
            {projects.map((project) => (
              <div key={project.id} className="admin-card">
                <div className="admin-card-info">
                  <p className="admin-card-title">{project.title}</p>
                  <p className="admin-card-tags">{project.tags?.join(', ')}</p>
                </div>
                <div className="admin-card-actions">
                  <button className="btn-edit" onClick={() => handleEdit(project)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(project.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Home tab ── */}
      {activeTab === 'home' && (
        <div className="admin-page-editor">
          <div className="admin-field">
            <label>Bio</label>
            <textarea value={homeBio} onChange={(e) => setHomeBio(e.target.value)} rows={5} />
          </div>
          <div className="admin-field">
            <label>Tech Tags <span>(comma separated)</span></label>
            <input value={homeTags} onChange={(e) => setHomeTags(e.target.value)} />
          </div>
          <div className="admin-editor-actions">
            <button className="btn-admin-save" onClick={saveHome} disabled={savingHome}>
              {savingHome ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* ── About tab ── */}
      {activeTab === 'about' && (
        <div className="admin-page-editor">
          {paragraphs.map((p, i) => (
            <div key={i} className="admin-field admin-para-row">
              <div className="admin-para-label">
                <label>Paragraph {i + 1}</label>
                <button className="btn-remove" onClick={() => setParagraphs(paragraphs.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
              <textarea
                value={p}
                onChange={(e) => {
                  const next = [...paragraphs]
                  next[i] = e.target.value
                  setParagraphs(next)
                }}
                rows={4}
              />
            </div>
          ))}
          <div className="admin-editor-actions">
            <button className="btn-admin-ghost" onClick={() => setParagraphs([...paragraphs, ''])}>
              + Add Paragraph
            </button>
            <button className="btn-admin-save" onClick={saveAbout} disabled={savingAbout}>
              {savingAbout ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* ── Resume tab ── */}
      {activeTab === 'resume' && (
        <div className="admin-page-editor">
          <p className="admin-section-label">Skills</p>
          {skills.map((s, i) => (
            <div key={i} className="admin-skill-row">
              <div className="admin-field admin-skill-category">
                <label>Category</label>
                <input value={s.category} onChange={(e) => updateSkill(i, 'category', e.target.value)} placeholder="Frontend" />
              </div>
              <div className="admin-field admin-skill-items">
                <label>Items <span>(comma separated)</span></label>
                <input value={s.items} onChange={(e) => updateSkill(i, 'items', e.target.value)} placeholder="React, TypeScript" />
              </div>
              <button className="btn-remove btn-remove-align" onClick={() => removeSkill(i)}>Remove</button>
            </div>
          ))}
          <button className="btn-admin-ghost" onClick={() => setSkills([...skills, { category: '', items: '' }])}>
            + Add Skill Group
          </button>

          <div className="admin-divider" style={{ margin: '2rem 0 1.5rem' }} />

          <p className="admin-section-label">Education</p>
          {education.map((e, i) => (
            <div key={i} className="admin-edu-row">
              <div className="admin-edu-fields">
                <div className="admin-field">
                  <label>Degree / Title</label>
                  <input value={e.title} onChange={(ev) => updateEdu(i, 'title', ev.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Institution</label>
                  <input value={e.institution} onChange={(ev) => updateEdu(i, 'institution', ev.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Date</label>
                  <input value={e.date} onChange={(ev) => updateEdu(i, 'date', ev.target.value)} placeholder="In Progress" />
                </div>
              </div>
              <button className="btn-remove" onClick={() => removeEdu(i)}>Remove</button>
            </div>
          ))}
          <button className="btn-admin-ghost" onClick={() => setEducation([...education, { title: '', date: '', institution: '' }])}>
            + Add Education
          </button>

          <div className="admin-editor-actions">
            <button className="btn-admin-save" onClick={saveResume} disabled={savingResume}>
              {savingResume ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
