import { useState, useMemo } from 'react'
import './App.css'

const GENRE_COLORS = {
  'Sci-Fi':      { accent: '#4A7C59', bg: '#E8F0EB', text: '#2D5A3D' },
  'Horror':      { accent: '#8B3A1A', bg: '#F0E4DC', text: '#6B2510' },
  'Drama':       { accent: '#7A5C3A', bg: '#EDE3D4', text: '#5C3D1E' },
  'Comedy':      { accent: '#6B8C3E', bg: '#E8EDD8', text: '#4A6B24' },
  'Action':      { accent: '#A0522D', bg: '#EFE2D5', text: '#7A3A18' },
  'Romance':     { accent: '#9B4B6A', bg: '#EFE0E7', text: '#7A2D4F' },
  'Thriller':    { accent: '#5C4A2A', bg: '#EAE2D4', text: '#3D2E10' },
  'Animation':   { accent: '#3A7A6B', bg: '#DFF0EB', text: '#1E5A4D' },
  'Fantasy':     { accent: '#6B4A8B', bg: '#E8E0F0', text: '#4A2D70' },
  'Documentary': { accent: '#5A6B3A', bg: '#E4EAD8', text: '#3A4D1E' },
}

const STATUS_STYLES = {
  'watched':       { dot: '#4A7C59', bg: '#E8F0EB', text: '#2D5A3D' },
  'watching':      { dot: '#A0522D', bg: '#EFE2D5', text: '#7A3A18' },
  'plan to watch': { dot: '#7A5C3A', bg: '#EDE3D4', text: '#5C3D1E' },
}

const GENRES = Object.keys(GENRE_COLORS)

const SAMPLE = [
  { id: 1, title: 'Inception', type: 'movie', genre: 'Sci-Fi', status: 'watched', my_rating: 9.5, gf_rating: 8 },
  { id: 2, title: 'The Bear', type: 'show', genre: 'Drama', status: 'watching', my_rating: 10, gf_rating: 9 },
  { id: 3, title: 'Hereditary', type: 'movie', genre: 'Horror', status: 'watched', my_rating: 9, gf_rating: 6 },
  { id: 4, title: 'Interstellar', type: 'movie', genre: 'Sci-Fi', status: 'plan to watch', my_rating: null, gf_rating: null },
]

function Card({ entry, onEdit, onDelete }) {
  const gc = GENRE_COLORS[entry.genre] || GENRE_COLORS['Drama']
  const ss = STATUS_STYLES[entry.status] || STATUS_STYLES['plan to watch']

  return (
    <div className="card">
      <div className="card-leaf" style={{ background: gc.accent }} />
      <div className="card-top">
        <div className="card-title">{entry.title}</div>
        <div className="card-actions">
          <button className="icon-btn" onClick={() => onEdit(entry)} title="Edit">✎</button>
          <button className="icon-btn del" onClick={() => onDelete(entry.id)} title="Delete">✕</button>
        </div>
      </div>
      <div className="card-meta">
        <span className="badge badge-type">{entry.type === 'movie' ? 'Film' : 'Series'}</span>
        <span className="genre-badge" style={{ background: gc.bg, color: gc.text }}>{entry.genre}</span>
        <span className="badge-status" style={{ background: ss.bg, color: ss.text }}>
          <span className="status-dot" style={{ background: ss.dot }} />
          {entry.status}
        </span>
      </div>
      <hr className="card-divider" />
      <div className="card-ratings">
        <div className="rating-block">
          <div className="rating-label">My rating</div>
          <div className="rating-val" style={{ color: gc.accent }}>
            {entry.my_rating ?? '—'}
          </div>
        </div>
        <div className="rating-divider" />
        <div className="rating-block">
          <div className="rating-label">GF rating</div>
          <div className="rating-val" style={{ color: gc.accent }}>
            {entry.gf_rating ?? '—'}
          </div>
        </div>
      </div>
    </div>
  )
}

function Modal({ entry, onSave, onClose }) {
  const blank = { title: '', type: 'movie', genre: 'Sci-Fi', status: 'plan to watch', my_rating: '', gf_rating: '' }
  const [form, setForm] = useState(
    entry ? { ...entry, my_rating: entry.my_rating ?? '', gf_rating: entry.gf_rating ?? '' } : blank
  )
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title.trim()) return
    onSave({
      ...form,
      my_rating: form.my_rating === '' ? null : parseFloat(form.my_rating),
      gf_rating: form.gf_rating === '' ? null : parseFloat(form.gf_rating),
    })
  }

  return (
    <div className="overlay" onClick={e => e.target.className === 'overlay' && onClose()}>
      <div className="modal">
        <div className="modal-title">{entry ? 'Edit entry' : 'Add to the list'}</div>

        <div className="field">
          <label>Title</label>
          <input type="text" value={form.title} placeholder="e.g. The Bear" onChange={e => set('title', e.target.value)} />
        </div>
        <div className="field">
          <label>Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="movie">Movie</option>
            <option value="show">Show</option>
          </select>
        </div>
        <div className="field">
          <label>Genre</label>
          <select value={form.genre} onChange={e => set('genre', e.target.value)}>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="watched">Watched</option>
            <option value="watching">Watching</option>
            <option value="plan to watch">Plan to watch</option>
          </select>
        </div>
        <div className="field">
          <label>My rating (1–10)</label>
          <input type="number" min="1" max="10" step="0.5" value={form.my_rating} onChange={e => set('my_rating', e.target.value)} />
        </div>
        <div className="field">
          <label>GF rating (1–10)</label>
          <input type="number" min="1" max="10" step="0.5" value={form.gf_rating} onChange={e => set('gf_rating', e.target.value)} />
        </div>

        <div className="modal-btns">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>{entry ? 'Save changes' : 'Add'}</button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [entries, setEntries] = useState(SAMPLE)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('none')

  const nextId = () => Math.max(0, ...entries.map(e => e.id)) + 1

  const handleSave = (data) => {
    if (data.id) {
      setEntries(es => es.map(e => e.id === data.id ? data : e))
    } else {
      setEntries(es => [...es, { ...data, id: nextId() }])
    }
    setModal(null)
  }

  const handleDelete = (id) => setEntries(es => es.filter(e => e.id !== id))

  const visible = useMemo(() => {
    let list = entries.filter(e => {
      if (filterType !== 'all' && e.type !== filterType) return false
      if (filterStatus !== 'all' && e.status !== filterStatus) return false
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.genre.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    if (sortBy === 'my_rating') list = [...list].sort((a, b) => (b.my_rating ?? -1) - (a.my_rating ?? -1))
    if (sortBy === 'gf_rating') list = [...list].sort((a, b) => (b.gf_rating ?? -1) - (a.gf_rating ?? -1))
    if (sortBy === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [entries, filterType, filterStatus, search, sortBy])

  const watched = entries.filter(e => e.status === 'watched').length
  const rated = entries.filter(e => e.my_rating)
  const avgMy = rated.length ? (rated.reduce((s, e) => s + e.my_rating, 0) / rated.length).toFixed(1) : '—'
  const ratedGf = entries.filter(e => e.gf_rating)
  const avgGf = ratedGf.length ? (ratedGf.reduce((s, e) => s + e.gf_rating, 0) / ratedGf.length).toFixed(1) : '—'

  return (
    <div id="app">
      <div className="app-header">
        <div>
          <div className="app-title">Our Watchlist</div>
          <div className="app-subtitle">A record of everything we've seen & everything we mean to</div>
        </div>
        <button className="btn-add" onClick={() => setModal({})}>+ Add entry</button>
      </div>

      <div className="stats-row">
        <div className="stat-cell">
          <div className="stat-num">{entries.length}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-cell">
          <div className="stat-num">{watched}</div>
          <div className="stat-label">Watched</div>
        </div>
        <div className="stat-cell">
          <div className="stat-num">{avgMy}</div>
          <div className="stat-label">My avg</div>
        </div>
        <div className="stat-cell">
          <div className="stat-num">{avgGf}</div>
          <div className="stat-label">GF avg</div>
        </div>
      </div>

      <div className="controls">
        <input placeholder="Search title or genre..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All types</option>
          <option value="movie">Films only</option>
          <option value="show">Series only</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="watched">Watched</option>
          <option value="watching">Watching</option>
          <option value="plan to watch">Plan to watch</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="none">Sort by...</option>
          <option value="title">Title A–Z</option>
          <option value="my_rating">My rating</option>
          <option value="gf_rating">GF rating</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">
          {entries.length === 0 ? 'Nothing here yet — add something to get started.' : 'No entries match your filters.'}
        </div>
      ) : (
        <div className="cards-grid">
          {visible.map(e => <Card key={e.id} entry={e} onEdit={setModal} onDelete={handleDelete} />)}
        </div>
      )}

      {modal !== null && (
        <Modal entry={modal.id ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
