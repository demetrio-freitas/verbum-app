import { useState } from 'react'
import DateBar from '../components/Leituras/DateBar.jsx'
import ReadingTabs from '../components/Leituras/ReadingTabs.jsx'
import ReadingToolbar from '../components/Leituras/ReadingToolbar.jsx'
import VerseWidget from '../components/Leituras/VerseWidget.jsx'
import ReadingCard from '../components/Leituras/ReadingCard.jsx'
import ReflectionCard from '../components/Leituras/ReflectionCard.jsx'
import SaintCard from '../components/Leituras/SaintCard.jsx'

export default function Home() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <>
      <DateBar
        liturgicalTitle="Segunda-feira da Oitava da Páscoa"
        dateDisplay="Segunda-feira, 06 de Abril de 2026"
        liturgicalColor="#FFFFFF"
        colorName="Branco"
      />

      <ReadingTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <ReadingToolbar />

      <div className="content-area">
        {(activeTab === 'all' || activeTab === 'all') && (
          <VerseWidget
            text={'"Ide anunciar a meus irmãos que se dirijam para a Galileia. Lá eles me verão."'}
            reference="Mateus 28,10"
          />
        )}

        {(activeTab === 'all' || activeTab === '1leitura') && (
          <ReadingCard label="Primeira Leitura" reference="Atos dos Apóstolos 2,14.22-33">
            <span>
              Naqueles dias, Pedro, de pé com os onze Apóstolos, levantou a voz e disse: "Homens de Israel, escutai estas palavras: Jesus de Nazaré foi um homem aprovado por Deus diante de vós com milagres, prodígios e sinais. Entregue segundo o plano determinado e a presciência de Deus, vós o matastes, pregando-o numa cruz por mãos de ímpios.
              <br /><br />
              <sup>24</sup>Mas Deus o ressuscitou, libertando-o das dores da morte, porque não era possível que ela o retivesse em seu poder. <sup>32</sup>A este Jesus, Deus o ressuscitou, e disso todos nós somos testemunhas. <sup>33</sup>Exaltado pela direita de Deus, tendo recebido do Pai o Espírito Santo prometido, derramou-o, como vedes e ouvis."
            </span>
          </ReadingCard>
        )}

        {(activeTab === 'all' || activeTab === 'salmo') && (
          <ReadingCard label="Salmo Responsorial" reference="Salmo 15 (16)">
            <span>
              <strong style={{ color: 'var(--accent)' }}>R: Guardai-me, ó Deus, porque em vós me refugio.</strong>
              <br /><br />
              O Senhor é a parte de minha herança e meu cálice;<br />
              é vós que garantis a minha sorte.<br />
              Tenho sempre o Senhor ante meus olhos,<br />
              pois, com ele à minha direita, não vacilarei. <strong>R.</strong>
              <br /><br />
              Por isso o meu coração se alegra,<br />
              a minha alma exulta de contentamento;<br />
              e até o meu corpo repousa tranquilo,<br />
              porque não me abandonareis na morte. <strong>R.</strong>
            </span>
          </ReadingCard>
        )}

        {(activeTab === 'all' || activeTab === 'evangelho') && (
          <ReadingCard label="Evangelho" reference="Mateus 28,8-15" isGospel>
            <span>
              <sup>8</sup>As mulheres partiram depressa do sepulcro. Com medo e com grande alegria, correram para dar a notícia aos discípulos.
              <br /><br />
              <sup>9</sup>E eis que Jesus veio ao encontro delas, e disse: "Alegrai-vos!" Elas se aproximaram, abraçaram seus pés e o adoraram. <sup>10</sup>Então Jesus disse a elas: "Não tenhais medo. Ide anunciar a meus irmãos que se dirijam para a Galileia. Lá eles me verão."
              <br /><br />
              <sup>11</sup>Enquanto as mulheres iam, alguns guardas foram à cidade e contaram aos sumos sacerdotes tudo o que tinha acontecido. <sup>15</sup>Os soldados receberam o dinheiro e fizeram como tinham sido instruídos. E essa história se espalhou entre os judeus até o dia de hoje.
            </span>
          </ReadingCard>
        )}

        {(activeTab === 'all') && (
          <>
            <ReflectionCard
              text={'"Alegrai-vos!" — É a primeira palavra do Ressuscitado às mulheres. Não um ensinamento, não uma ordem complexa, mas um convite à alegria. A Páscoa é isto: a alegria que nasce do encontro com o Cristo vivo. Ele vem ao nosso encontro, mesmo quando estamos com medo.'}
              author="Reflexão Verbum — Segunda da Oitava da Páscoa"
            />

            <SaintCard
              monogram="OP"
              name="Oitava da Páscoa"
              description="Os oito dias que seguem o Domingo de Páscoa são celebrados como se fossem um único grande dia. Cada dia é tratado como solenidade — a alegria da Ressurreição se prolonga por toda a semana."
            />
          </>
        )}

        {activeTab === 'santo' && (
          <SaintCard
            monogram="OP"
            name="Oitava da Páscoa"
            description="Os oito dias que seguem o Domingo de Páscoa são celebrados como se fossem um único grande dia. Cada dia é tratado como solenidade — a alegria da Ressurreição se prolonga por toda a semana."
          />
        )}

        <div style={{ height: 100 }} />
      </div>
    </>
  )
}
