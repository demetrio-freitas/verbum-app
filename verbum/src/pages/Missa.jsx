import { useNavigate } from 'react-router-dom'
import MissaPart from '../components/Missa/MissaPart.jsx'
import MissaDialog, { MissaLine, MissaPrayer } from '../components/Missa/MissaDialog.jsx'
import useModoMissa from '../hooks/useModoMissa.js'
import { toast } from '../components/shared/Toast.jsx'

export default function Missa() {
  const { active, toggle } = useModoMissa()
  const navigate = useNavigate()

  function handleToggle() {
    toggle()
    toast(active ? 'Modo Missa desativado' : 'Modo Missa ativado — tela sempre ligada')
  }

  return (
    <>
      <div className="missa-header-card">
        <div className="missa-title">Santa Missa</div>
        <div className="missa-subtitle">Domingo de Páscoa</div>
        <div className="missa-date">5 de Abril de 2026 • Tempo Pascal</div>
      </div>

      <button className={`modo-missa-toggle ${active ? 'active' : ''}`} onClick={handleToggle}>
        <span className="material-symbols-rounded">phone_android</span>
        {active ? 'Modo Missa Ativo' : 'Ativar Modo Missa'}
      </button>

      {/* RITOS INICIAIS */}
      <MissaPart id="missa-ritos-iniciais" number="Parte I" label="Ritos Iniciais" icon="church">
        <MissaDialog title="Saudação">
          <MissaLine rubric>O sacerdote faz o sinal da cruz e saúda o povo.</MissaLine>
          <MissaLine role="S">Em nome do Pai e do Filho e do Espírito Santo.</MissaLine>
          <MissaLine role="P">Amém.</MissaLine>
          <MissaLine role="S">A graça de nosso Senhor Jesus Cristo, o amor do Pai e a comunhão do Espírito Santo estejam convosco.</MissaLine>
          <MissaLine role="P">Bendito seja Deus, que nos reuniu no amor de Cristo.</MissaLine>
        </MissaDialog>

        <MissaDialog title="Ato Penitencial" variableNote="O celebrante escolhe uma das 3 formas">
          <MissaLine rubric>Forma I — Confiteor</MissaLine>
          <MissaLine role="P">Confesso a Deus todo-poderoso e a vós, irmãos e irmãs, que pequei muitas vezes por pensamentos e palavras, atos e omissões, por minha culpa, minha tão grande culpa. E peço à Virgem Maria, aos anjos e santos, e a vós, irmãos e irmãs, que rogueis por mim a Deus, nosso Senhor.</MissaLine>
          <MissaLine role="S">Deus todo-poderoso tenha compaixão de nós, perdoe os nossos pecados e nos conduza à vida eterna.</MissaLine>
          <MissaLine role="P">Amém.</MissaLine>
        </MissaDialog>

        <MissaDialog title="Senhor, tende piedade">
          <MissaLine role="S">Senhor, tende piedade de nós.</MissaLine>
          <MissaLine role="P">Senhor, tende piedade de nós.</MissaLine>
          <MissaLine role="S">Cristo, tende piedade de nós.</MissaLine>
          <MissaLine role="P">Cristo, tende piedade de nós.</MissaLine>
          <MissaLine role="S">Senhor, tende piedade de nós.</MissaLine>
          <MissaLine role="P">Senhor, tende piedade de nós.</MissaLine>
        </MissaDialog>

        <MissaDialog title="Glória">
          <MissaLine rubric>Rezado ou cantado aos domingos (exceto Advento e Quaresma) e solenidades.</MissaLine>
          <MissaPrayer>
            Glória a Deus nas alturas e paz na terra aos homens por Ele amados. Senhor Deus, Rei dos céus, Deus Pai todo-poderoso: nós Vos louvamos, nós Vos bendizemos, nós Vos adoramos, nós Vos glorificamos, nós Vos damos graças por vossa imensa glória.
            <br /><br />
            Senhor Jesus Cristo, Filho Unigênito, Senhor Deus, Cordeiro de Deus, Filho de Deus Pai: Vós que tirais o pecado do mundo, tende piedade de nós; Vós que tirais o pecado do mundo, acolhei a nossa súplica; Vós que estais à direita do Pai, tende piedade de nós.
            <br /><br />
            Só Vós sois o Santo; só Vós, o Senhor; só Vós, o Altíssimo, Jesus Cristo; com o Espírito Santo, na glória de Deus Pai. Amém.
          </MissaPrayer>
        </MissaDialog>
      </MissaPart>

      {/* LITURGIA DA PALAVRA */}
      <MissaPart id="missa-liturgia-palavra" number="Parte II" label="Liturgia da Palavra" icon="menu_book">
        <div className="missa-leituras-link" onClick={() => navigate('/')}>
          <span className="material-symbols-rounded">menu_book</span>
          Ver leituras completas do dia
        </div>

        <MissaDialog title="Aclamação ao Evangelho">
          <MissaLine role="P">Aleluia, Aleluia, Aleluia!</MissaLine>
          <MissaLine role="S">O Senhor esteja convosco.</MissaLine>
          <MissaLine role="P">Ele está no meio de nós.</MissaLine>
          <MissaLine role="S">Proclamação do Evangelho de Jesus Cristo segundo João.</MissaLine>
          <MissaLine role="P">Glória a vós, Senhor!</MissaLine>
          <MissaLine rubric>Após a leitura:</MissaLine>
          <MissaLine role="S">Palavra da salvação.</MissaLine>
          <MissaLine role="P">Glória a vós, Senhor!</MissaLine>
        </MissaDialog>

        <MissaDialog title="Profissão de Fé (Creio)">
          <MissaPrayer>
            Creio em Deus Pai todo-poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai todo-poderoso, de onde há de vir a julgar os vivos e os mortos.
            <br /><br />
            Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.
          </MissaPrayer>
        </MissaDialog>

        <MissaDialog title="Oração dos Fiéis" variableNote="As preces variam conforme a celebração">
          <MissaLine rubric>Após cada intenção:</MissaLine>
          <MissaLine role="P">Senhor, escutai a nossa prece!</MissaLine>
        </MissaDialog>
      </MissaPart>

      {/* LITURGIA EUCARÍSTICA */}
      <MissaPart id="missa-liturgia-eucaristica" number="Parte III" label="Liturgia Eucarística" icon="local_dining">
        <MissaDialog title="Apresentação das Oferendas">
          <MissaLine role="S">Bendito sejais, Senhor, Deus do universo, pelo pão que recebemos de vossa bondade, fruto da terra e do trabalho do homem, que agora vos apresentamos e para nós se vai tornar pão da vida.</MissaLine>
          <MissaLine role="P">Bendito seja Deus para sempre!</MissaLine>
          <MissaLine role="S">Orai, irmãos e irmãs, para que o nosso sacrifício seja aceito por Deus Pai todo-poderoso.</MissaLine>
          <MissaLine role="P">Receba o Senhor por tuas mãos este sacrifício, para glória do seu nome, para nosso bem e de toda a sua santa Igreja.</MissaLine>
        </MissaDialog>

        <MissaDialog title="Prefácio">
          <MissaLine role="S">O Senhor esteja convosco.</MissaLine>
          <MissaLine role="P">Ele está no meio de nós.</MissaLine>
          <MissaLine role="S">Corações ao alto!</MissaLine>
          <MissaLine role="P">O nosso coração está em Deus.</MissaLine>
          <MissaLine role="S">Demos graças ao Senhor, nosso Deus.</MissaLine>
          <MissaLine role="P">É nosso dever e nossa salvação.</MissaLine>
        </MissaDialog>

        <MissaDialog title="Santo">
          <MissaPrayer><strong>Santo, Santo, Santo, Senhor Deus do universo! O céu e a terra proclamam a vossa glória. Hosana nas alturas! Bendito o que vem em nome do Senhor! Hosana nas alturas!</strong></MissaPrayer>
        </MissaDialog>

        <MissaDialog title="Oração Eucarística">
          <MissaLine rubric>Narrativa da Instituição e Consagração.</MissaLine>
          <MissaLine role="S">Tomai, todos, e comei: isto é o meu Corpo, que será entregue por vós.</MissaLine>
          <MissaLine rubric>O sacerdote eleva a hóstia consagrada.</MissaLine>
          <MissaLine role="S">Tomai, todos, e bebei: este é o cálice do meu Sangue, o Sangue da nova e eterna Aliança, que será derramado por vós e por todos, para remissão dos pecados. Fazei isto em memória de Mim.</MissaLine>
          <MissaLine role="S">Eis o mistério da fé!</MissaLine>
          <MissaLine role="P">Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde, Senhor Jesus!</MissaLine>
        </MissaDialog>

        <MissaDialog title="Pai Nosso">
          <MissaPrayer>
            Pai nosso que estais nos céus, santificado seja o vosso nome, venha a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal.
          </MissaPrayer>
          <MissaLine role="P">Vosso é o reino, o poder e a glória para sempre!</MissaLine>
        </MissaDialog>

        <MissaDialog title="Cordeiro de Deus">
          <MissaPrayer>
            Cordeiro de Deus, que tirais o pecado do mundo, <strong>tende piedade de nós</strong>.<br />
            Cordeiro de Deus, que tirais o pecado do mundo, <strong>tende piedade de nós</strong>.<br />
            Cordeiro de Deus, que tirais o pecado do mundo, <strong>dai-nos a paz</strong>.
          </MissaPrayer>
        </MissaDialog>

        <MissaDialog title="Comunhão">
          <MissaLine role="S">Eis o Cordeiro de Deus, que tira o pecado do mundo. Felizes os convidados para a ceia do Senhor.</MissaLine>
          <MissaLine role="P">Senhor, eu não sou digno(a) de que entreis em minha morada, mas dizei uma palavra e serei salvo(a).</MissaLine>
        </MissaDialog>
      </MissaPart>

      {/* RITOS FINAIS */}
      <MissaPart id="missa-ritos-finais" number="Parte IV" label="Ritos Finais" icon="waving_hand">
        <MissaDialog title="Bênção Final">
          <MissaLine role="S">O Senhor esteja convosco.</MissaLine>
          <MissaLine role="P">Ele está no meio de nós.</MissaLine>
          <MissaLine role="S">Abençoe-vos Deus todo-poderoso, Pai e Filho e Espírito Santo.</MissaLine>
          <MissaLine role="P">Amém.</MissaLine>
        </MissaDialog>
        <MissaDialog title="Envio">
          <MissaLine role="S">Ide em paz e o Senhor vos acompanhe.</MissaLine>
          <MissaLine role="P">Graças a Deus.</MissaLine>
        </MissaDialog>
      </MissaPart>

      <div style={{ height: 100 }} />
    </>
  )
}
