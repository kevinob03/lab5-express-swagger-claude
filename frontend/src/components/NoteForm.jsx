export default function NoteForm({ title, content, busy, onTitleChange, onContentChange, onSubmit }) {
  return (
    <form className="panel create-panel" onSubmit={onSubmit}>
      <div className="panel-title"><span className="icon-tile">＋</span><div><h3>Nueva nota</h3><p>Captura una idea antes de que se escape.</p></div></div>
      <label htmlFor="note-title">Título</label>
      <input id="note-title" value={title} onChange={(event) => onTitleChange(event.target.value)} maxLength={100} placeholder="Ej. Ideas para el proyecto" required />
      <label htmlFor="note-content">Contenido</label>
      <textarea id="note-content" value={content} onChange={(event) => onContentChange(event.target.value)} maxLength={5000} rows={5} placeholder="Escribe aquí tu nota..." required />
      <div className="form-footer"><span>{content.length}/5000</span><button className="button primary-button" disabled={busy}>{busy ? 'Guardando…' : 'Guardar nota'} <span>↗</span></button></div>
    </form>
  )
}
