import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import './admin.css'

const emptyForm = {
  title: '',
  tags: '',
  description: '',
  enhancements: '',
  githubUrl: '',
  overview: '',
  highlights: '',
  role: '',
  status: '',
}

export default function Admin() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjects(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsubscribe
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

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

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-tag">Admin</p>
          <h1 className="admin-title">Projects</h1>
        </div>
        <div className="admin-header-actions">
          {!showForm && (
            <button className="btn-admin-add" onClick={() => setShowForm(true)}>+ Add Project</button>
          )}
          <button className="btn-admin-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-divider" />

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
    </div>
  )
}
