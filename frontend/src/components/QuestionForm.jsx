export default function QuestionForm({ question, answer, busy, onQuestionChange, onSubmit }) {
  return (
    <form className="assistant-panel" onSubmit={onSubmit}>
      <label htmlFor="question">¿En qué estás pensando?</label>
      <div className="question-row"><input id="question" value={question} onChange={(event) => onQuestionChange(event.target.value)} minLength={3} maxLength={2000} placeholder="Escribe una pregunta…" required /><button className="button dark-button" disabled={busy}>{busy ? 'Pensando…' : 'Preguntar'} <span>↗</span></button></div>
      {answer && <div className="answer-box" role="status"><span className="summary-label">RESPUESTA</span><p>{answer.respuesta}</p><small>{answer.uso.input_tokens} tokens de entrada · {answer.uso.output_tokens} de salida</small></div>}
    </form>
  )
}
