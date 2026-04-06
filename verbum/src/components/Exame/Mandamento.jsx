import { useState } from 'react'

export default function Mandamento({ number, title, questions, onToggle }) {
  const [open, setOpen] = useState(false)

  const checkedCount = questions.filter(q => q.checked).length

  return (
    <div className={`exame-mandamento ${open ? 'open' : ''}`}>
      <div className="exame-mandamento-header" onClick={() => setOpen(!open)}>
        <div className="exame-mandamento-num">{number}</div>
        <div className="exame-mandamento-title">{title}</div>
        <div className="exame-mandamento-count">{checkedCount}</div>
        <div className="exame-mandamento-arrow">expand_more</div>
      </div>
      <div className="exame-mandamento-body">
        <div className="exame-mandamento-body-inner">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`exame-pergunta ${q.checked ? 'checked' : ''}`}
              onClick={() => onToggle(number - 1, i)}
            >
              <div className="exame-check">check</div>
              <div className="exame-pergunta-text">
                {q.text}
                {q.tag && <span className="exame-pergunta-tag">{q.tag}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
