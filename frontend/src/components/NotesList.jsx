export default function NotesList({ notes, loading, busy, onDelete, onSummarize }) {
  if (loading) return <div className="empty-state">Cargando tus notas…</div>
  if (!notes.length) return <div className="empty-state"><span className="empty-icon">✎</span><h3>Tu página está en blanco</h3><p>Crea tu primera nota para empezar.</p></div>
  return (
    <div className="notes-column">
      {notes.map((note) => (
        <article className="panel note-card" key={note.id}>
          <div className="note-card-heading"><span className="note-number">NOTA {String(note.id).padStart(2, '0')}</span><button className="icon-button" onClick={() => onDelete(note.id)} disabled={busy} aria-label={`Eliminar ${note.titulo}`}>×</button></div>
          <h3>{note.titulo}</h3><p className="note-content">{note.contenido}</p>
          {note.summary && <div className="summary-box"><span className="summary-label">✦ RESUMEN</span><p>{note.summary}</p><small>{note.usage?.input_tokens} entrada · {note.usage?.output_tokens} salida</small></div>}
          <button className="text-button" onClick={() => onSummarize(note.id)} disabled={busy}>✦ {note.summary ? 'Generar otro resumen' : 'Resumir con IA'}</button>
        </article>
      ))}
    </div>
  )
}
