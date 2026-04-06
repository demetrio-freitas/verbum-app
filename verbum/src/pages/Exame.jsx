import { useState } from 'react'
import Mandamento from '../components/Exame/Mandamento.jsx'
import { toast } from '../components/shared/Toast.jsx'

const initialData = [
  { title: 'Amar a Deus sobre todas as coisas', questions: [
    { text: 'Tenho duvidado da existência de Deus ou da minha fé?' },
    { text: 'Deixei de rezar por muito tempo?' },
    { text: 'Coloquei dinheiro, trabalho ou outra coisa acima de Deus?' },
    { text: 'Participei de superstições, horóscopo ou ocultismo?' },
    { text: 'Fui ingrato(a) com Deus?' },
    { text: 'Tenho vergonha de demonstrar minha fé?' },
  ]},
  { title: 'Não tomar o Nome de Deus em vão', questions: [
    { text: 'Usei o nome de Deus como palavrão?' },
    { text: 'Fiz juramentos falsos?' },
    { text: 'Falei da Igreja com desrespeito?' },
    { text: 'Amaldiçoei ou desejei mal a alguém?' },
  ]},
  { title: 'Guardar domingos e festas', questions: [
    { text: 'Deixei de ir à Missa no domingo sem motivo grave?' },
    { text: 'Cheguei atrasado(a) ou saí antes do fim?' },
    { text: 'Fiquei no celular durante a Missa?' },
    { text: 'Trabalhei no domingo sem necessidade?' },
  ]},
  { title: 'Honrar pai e mãe', questions: [
    { text: 'Desrespeitei ou maltratei meus pais?' },
    { text: 'Deixei de ajudar meus pais quando precisaram?' },
    { text: 'Causei sofrimento à família por egoísmo?' },
    { text: 'Fui negligente na educação dos filhos?', tag: 'Casado(a)' },
    { text: 'Tive vergonha dos pais diante dos amigos?', tag: 'Jovem' },
  ]},
  { title: 'Não matar', questions: [
    { text: 'Tive ódio, rancor ou desejo de vingança?' },
    { text: 'Briguei ou fui violento(a)?' },
    { text: 'Guardei mágoa e me recusei a perdoar?' },
    { text: 'Prejudiquei minha saúde com excessos?' },
    { text: 'Fui indiferente ao sofrimento alheio?' },
    { text: 'Pratiquei bullying?', tag: 'Jovem' },
  ]},
  { title: 'Não pecar contra a castidade', questions: [
    { text: 'Consenti em pensamentos impuros?' },
    { text: 'Assisti pornografia?' },
    { text: 'Pratiquei atos impuros?' },
    { text: 'Fui infiel ao cônjuge?', tag: 'Casado(a)' },
    { text: 'Quebrei voto de castidade?', tag: 'Religioso(a)' },
  ]},
  { title: 'Não roubar', questions: [
    { text: 'Roubei ou peguei algo alheio?' },
    { text: 'Fui desonesto(a) no trabalho ou estudos?' },
    { text: 'Danifiquei propriedade alheia?' },
    { text: 'Deixei de pagar dívidas podendo?' },
    { text: 'Colei em provas?', tag: 'Jovem' },
  ]},
  { title: 'Não levantar falso testemunho', questions: [
    { text: 'Menti prejudicando alguém?' },
    { text: 'Fofoquei ou espalhei boatos?' },
    { text: 'Julguei alguém sem conhecer os fatos?' },
    { text: 'Revelei segredos confiados?' },
    { text: 'Espalhei fake news nas redes?' },
  ]},
  { title: 'Não cobiçar o cônjuge alheio', questions: [
    { text: 'Desejei intimidade com pessoa comprometida?' },
    { text: 'Alimentei fantasias impuras?' },
    { text: 'Flertei com pessoa comprometida?' },
    { text: 'Tive ciúmes excessivos?', tag: 'Casado(a)' },
  ]},
  { title: 'Não cobiçar as coisas alheias', questions: [
    { text: 'Tive inveja dos bens ou sucesso alheio?' },
    { text: 'Fui ganancioso(a) enquanto outros precisam?' },
    { text: 'Reclamei da vida sem gratidão?' },
    { text: 'Deixei de ser generoso(a)?' },
    { text: 'Inveja de likes/aparência nas redes?', tag: 'Jovem' },
  ]},
]

const contricoes = {
  tradicional: 'Meu Deus, eu me arrependo de todo coração de Vos ter ofendido, porque sois infinitamente bom e o pecado Vos desagrada. Proponho firmemente, com a ajuda da vossa graça, não mais Vos ofender e fugir das ocasiões próximas de pecado. Peço-Vos perdão pela Paixão e Morte de Nosso Senhor Jesus Cristo. Amém.',
  moderna: 'Senhor meu Jesus Cristo, Deus de amor e de misericórdia, eu me arrependo de todos os meus pecados. Arrependo-me porque ofendi a Vós, que sois tão bom. Ajudai-me a não pecar mais e a viver segundo o vosso Evangelho. Amém.',
  breve: 'Senhor, tende piedade de mim, pecador(a). Arrependo-me de todo coração. Ajudai-me a não pecar mais. Amém.',
}

export default function Exame() {
  const [mandamentos, setMandamentos] = useState(() =>
    initialData.map(m => ({ ...m, questions: m.questions.map(q => ({ ...q, checked: false })) }))
  )
  const [showResumo, setShowResumo] = useState(false)
  const [contricaoTab, setContricaoTab] = useState('tradicional')

  function toggleQuestion(mIdx, qIdx) {
    setMandamentos(prev => prev.map((m, mi) =>
      mi === mIdx ? { ...m, questions: m.questions.map((q, qi) =>
        qi === qIdx ? { ...q, checked: !q.checked } : q
      )} : m
    ))
  }

  function limpar() {
    if (!confirm('Tem certeza? Todos os itens marcados serão apagados permanentemente.')) return
    setMandamentos(prev => prev.map(m => ({ ...m, questions: m.questions.map(q => ({ ...q, checked: false })) })))
    setShowResumo(false)
    toast('Exame limpo. Todos os dados foram apagados.')
  }

  const checkedItems = mandamentos.flatMap(m => m.questions.filter(q => q.checked))

  return (
    <>
      <div className="exame-header-card">
        <div className="exame-title">Exame de Consciência</div>
        <div className="exame-subtitle">Preparação para o Sacramento da Reconciliação</div>
      </div>

      <div className="exame-disclaimer">
        <span className="material-symbols-rounded">info</span>
        <span>A absolvição dos pecados só é concedida por um sacerdote no Sacramento da Reconciliação. Este exame é apenas uma ferramenta de preparação pessoal.</span>
      </div>

      <div className="exame-privacy-bar">
        <span className="material-symbols-rounded">lock</span>
        100% privado — nenhum dado sai do seu celular
      </div>

      <div className="exame-actions">
        <button className="exame-action-btn primary" onClick={() => setShowResumo(!showResumo)}>
          <span className="material-symbols-rounded" style={{ fontSize: 18 }}>checklist</span> Ver meu resumo
        </button>
        <button className="exame-action-btn danger" onClick={limpar}>
          <span className="material-symbols-rounded" style={{ fontSize: 18 }}>delete_forever</span> Limpar tudo
        </button>
      </div>

      {showResumo && (
        <div className="exame-resumo visible">
          <div className="exame-resumo-title">Meu resumo pessoal</div>
          <div className="exame-resumo-desc">Leve esta lista ao confessionário.</div>
          {checkedItems.length === 0 ? (
            <div className="exame-resumo-empty">Nenhum item marcado ainda.</div>
          ) : (
            <ul className="exame-resumo-list">
              {checkedItems.map((q, i) => <li key={i}>{q.text}</li>)}
            </ul>
          )}
        </div>
      )}

      {mandamentos.map((m, i) => (
        <Mandamento key={i} number={i + 1} title={m.title} questions={m.questions} onToggle={toggleQuestion} />
      ))}

      {/* Ato de Contrição */}
      <div className="exame-contricao">
        <div className="exame-rito-title">
          <span className="material-symbols-rounded">folded_hands</span> Ato de Contrição
        </div>
        <div className="exame-contricao-tabs">
          {Object.keys(contricoes).map(key => (
            <button
              key={key}
              className={`exame-contricao-tab ${contricaoTab === key ? 'active' : ''}`}
              onClick={() => setContricaoTab(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        <div className="exame-contricao-text">{contricoes[contricaoTab]}</div>
      </div>

      <div style={{ height: 100 }} />
    </>
  )
}
