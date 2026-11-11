import { useEffect, useState } from 'react'
import './App.css'

async function requestJson(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const result = response.status === 204 ? null : await response.json()
  if (!response.ok) throw new Error(result?.error || 'No se pudo completar la solicitud.')
  return result
}

function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function loadNotes() {
    const data = await requestJson('/api/notas')
    setNotes(data)
  }

  useEffect(() => {
    loadNotes()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function createNote(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await requestJson('/api/notas', {
        method: 'POST',
        body: JSON.stringify({ titulo: title, contenido: content }),
      })
      setTitle('')
      setContent('')
      await loadNotes()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function deleteNote(id) {
    setBusy(true)
    setError('')
    try {
      await requestJson(`/api/notas/${id}`, { method: 'DELETE' })
      await loadNotes()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function summarizeNote(id) {
    setBusy(true)
    setError('')
    try {
      const result = await requestJson(`/api/notas/${id}/resumen`, { method: 'POST' })
      setNotes((current) => current.map((note) => (
        note.id === id ? { ...note, summary: result.resumen, usage: result.uso } : note
      )))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function askDeepSeek(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setAnswer(null)
    try {
      const result = await requestJson('/api/ia/preguntar', {
        method: 'POST',
        body: JSON.stringify({ pregunta: question }),
      })
      setAnswer(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Notas con IA, inicio">
          <span className="brand-mark">N</span>
          <span>Notas<span className="brand-light"> con IA</span></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#notas">Mis notas</a>
          <a href="#preguntar">Asistente IA</a>
          <a className="docs-link" href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer">Swagger ↗</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> API REST · DEEPSEEK</p>
          <h1>Tus ideas,<br /><span>bien organizadas.</span></h1>
          <p className="hero-text">Guarda notas, resume lo importante y conversa con tu asistente de IA.</p>
          <a className="primary-link" href="#notas">Explorar mis notas <span>↓</span></a>
        </div>
        <div className="hero-card" aria-label="Resumen del proyecto">
          <div className="card-orbit orbit-one" />
          <div className="card-orbit orbit-two" />
          <span className="spark spark-one">✦</span><span className="spark spark-two">✧</span>
          <div className="hero-note">
            <span className="note-label">UNA IDEA PARA HOY</span>
            <p>“El conocimiento crece cuando lo escribimos.”</p>
            <span className="note-byline">— Cuaderno inteligente</span>
          </div>
          <div className="floating-pill"><span>✦</span> Resúmenes con IA</div>
        </div>
      </section>

      {error && <div className="notice error-notice" role="alert">{error}</div>}

      <section className="workspace" id="notas">
        <div className="section-heading">
          <div><p className="eyebrow">TU ESPACIO</p><h2>Mis notas</h2></div>
          <span className="count-badge">{notes.length} {notes.length === 1 ? 'nota' : 'notas'}</span>
        </div>

        <div className="notes-layout">
          <form className="panel create-panel" onSubmit={createNote}>
            <div className="panel-title"><span className="icon-tile">＋</span><div><h3>Nueva nota</h3><p>Captura una idea antes de que se escape.</p></div></div>
            <label htmlFor="note-title">Título</label>
            <input id="note-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} placeholder="Ej. Ideas para el proyecto" required />
            <label htmlFor="note-content">Contenido</label>
            <textarea id="note-content" value={content} onChange={(event) => setContent(event.target.value)} maxLength={5000} rows={5} placeholder="Escribe aquí tu nota..." required />
            <div className="form-footer"><span>{content.length}/5000</span><button className="button primary-button" disabled={busy}>{busy ? 'Guardando…' : 'Guardar nota'} <span>↗</span></button></div>
          </form>

          <div className="notes-column">
            {loading ? <div className="empty-state">Cargando tus notas…</div> : notes.length === 0 ? (
              <div className="empty-state"><span className="empty-icon">✎</span><h3>Tu página está en blanco</h3><p>Crea tu primera nota para empezar.</p></div>
            ) : notes.map((note) => (
              <article className="panel note-card" key={note.id}>
                <div className="note-card-heading"><span className="note-number">NOTA {String(note.id).padStart(2, '0')}</span><button className="icon-button" onClick={() => deleteNote(note.id)} disabled={busy} aria-label={`Eliminar ${note.titulo}`} title="Eliminar nota">×</button></div>
                <h3>{note.titulo}</h3><p className="note-content">{note.contenido}</p>
                {note.summary && <div className="summary-box"><span className="summary-label">✦ RESUMEN</span><p>{note.summary}</p><small>{note.usage?.input_tokens} entrada · {note.usage?.output_tokens} salida</small></div>}
                <button className="text-button" onClick={() => summarizeNote(note.id)} disabled={busy}>✦ {note.summary ? 'Generar otro resumen' : 'Resumir con IA'}</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="assistant-section" id="preguntar">
        <div className="assistant-intro"><p className="eyebrow">UNA MANO CUANDO LA NECESITAS</p><h2>Pregunta lo que quieras.</h2><p>DeepSeek responde desde tu backend. Tu clave nunca llega al navegador.</p></div>
        <form className="assistant-panel" onSubmit={askDeepSeek}>
          <label htmlFor="question">¿En qué estás pensando?</label>
          <div className="question-row"><input id="question" value={question} onChange={(event) => setQuestion(event.target.value)} minLength={3} maxLength={2000} placeholder="Escribe una pregunta…" required /><button className="button dark-button" disabled={busy}>{busy ? 'Pensando…' : 'Preguntar'} <span>↗</span></button></div>
          {answer && <div className="answer-box" role="status"><span className="summary-label">RESPUESTA</span><p>{answer.respuesta}</p><small>{answer.uso.input_tokens} tokens de entrada · {answer.uso.output_tokens} de salida</small></div>}
        </form>
      </section>

      <footer><span>Notas con IA</span><span>Express · SQLite · React · DeepSeek</span><a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer">Documentación API ↗</a></footer>
    </main>
  )
}

export default App
