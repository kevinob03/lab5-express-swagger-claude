import { useEffect, useState } from 'react'
import NoteForm from '../components/NoteForm.jsx'
import NotesList from '../components/NotesList.jsx'
import QuestionForm from '../components/QuestionForm.jsx'
import './NotesPage.css'
import '../dark-theme.css'

async function requestJson(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const result = response.status === 204 ? null : await response.json()
  if (!response.ok) throw new Error(result?.error || 'No se pudo completar la solicitud.')
  return result
}

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function loadNotes() {
    setNotes(await requestJson('/api/notas'))
  }

  useEffect(() => {
    loadNotes().catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [])

  async function createNote(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      await requestJson('/api/notas', { method: 'POST', body: JSON.stringify({ titulo: title, contenido: content }) })
      setTitle(''); setContent(''); await loadNotes()
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  async function deleteNote(id) {
    setBusy(true); setError('')
    try { await requestJson(`/api/notas/${id}`, { method: 'DELETE' }); await loadNotes() }
    catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  async function summarizeNote(id) {
    setBusy(true); setError('')
    try {
      const result = await requestJson(`/api/notas/${id}/resumen`, { method: 'POST' })
      setNotes((current) => current.map((note) => note.id === id ? { ...note, summary: result.resumen, usage: result.uso } : note))
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  async function askDeepSeek(event) {
    event.preventDefault(); setBusy(true); setError(''); setAnswer(null)
    try { setAnswer(await requestJson('/api/ia/preguntar', { method: 'POST', body: JSON.stringify({ pregunta: question }) })) }
    catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Notas con IA, inicio"><span className="brand-mark">N</span><span>Notas<span className="brand-light"> con IA</span></span></a>
        <nav aria-label="Navegación principal"><a href="#notas">Mis notas</a><a href="#preguntar">Asistente IA</a><a className="docs-link" href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer">Swagger ↗</a></nav>
      </header>
      <section className="hero" id="inicio">
        <div className="hero-copy"><h1>Tus ideas,<br /><span>bien organizadas.</span></h1><p className="hero-text">Guarda notas, resume lo importante y conversa con tu asistente de IA.</p><a className="primary-link" href="#notas">Explorar mis notas <span>↓</span></a></div>
        <div className="hero-card" aria-label="Resumen del proyecto"><div className="card-orbit orbit-one" /><div className="card-orbit orbit-two" /><span className="spark spark-one">✦</span><span className="spark spark-two">✧</span><div className="hero-note"><span className="note-label">UNA IDEA PARA HOY</span><p>“El conocimiento crece cuando lo escribimos.”</p><span className="note-byline">— Cuaderno inteligente</span></div><div className="floating-pill"><span>✦</span> Resúmenes con IA</div></div>
      </section>
      {error && <div className="notice error-notice" role="alert">{error}</div>}
      <section className="workspace" id="notas">
        <div className="section-heading"><div><p className="eyebrow">TU ESPACIO</p><h2>Mis notas</h2></div><span className="count-badge">{notes.length} {notes.length === 1 ? 'nota' : 'notas'}</span></div>
        <div className="notes-layout">
          <NoteForm title={title} content={content} busy={busy} onTitleChange={setTitle} onContentChange={setContent} onSubmit={createNote} />
          <NotesList notes={notes} loading={loading} busy={busy} onDelete={deleteNote} onSummarize={summarizeNote} />
        </div>
      </section>
      <section className="assistant-section" id="preguntar"><div className="assistant-intro"><p className="eyebrow">UNA MANO CUANDO LA NECESITAS</p><h2>Pregunta lo que quieras.</h2><p>Comparte una duda, explora una idea o descubre algo nuevo.</p></div><QuestionForm question={question} answer={answer} busy={busy} onQuestionChange={setQuestion} onSubmit={askDeepSeek} /></section>
      <footer><span>Notas con IA</span><span>Express · SQLite · React · DeepSeek</span><a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer">Documentación API ↗</a><span aria-hidden="true" style={{ display: 'none' }}>&#x20;</span></footer>
    </main>
  )
}
