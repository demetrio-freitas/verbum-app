import DateBar from '../components/Leituras/DateBar.jsx'
import VerseWidget from '../components/Leituras/VerseWidget.jsx'
import ReadingCard from '../components/Leituras/ReadingCard.jsx'
import ReflectionCard from '../components/Leituras/ReflectionCard.jsx'
import SaintCard from '../components/Leituras/SaintCard.jsx'

export default function Home() {
  return (
    <>
      <DateBar
        liturgicalTitle="Domingo de Páscoa"
        dateDisplay="Domingo, 05 de Abril de 2026"
        liturgicalColor="#FFFFFF"
        colorName="Branco"
      />

      <div className="content-area">
        <VerseWidget
          text={'"Ele viu e acreditou. De fato, eles ainda não tinham compreendido a Escritura, segundo a qual Jesus devia ressuscitar dos mortos."'}
          reference="João 20,8-9"
        />

        <ReadingCard label="Primeira Leitura" reference="Atos dos Apóstolos 10,34a.37-43">
          <span>
            Naqueles dias, Pedro tomou a palavra e disse: <sup>37</sup>"Vós sabeis o que aconteceu em toda a Judeia, a começar pela Galileia, depois do batismo pregado por João: <sup>38</sup>como Deus ungiu Jesus de Nazaré com o Espírito Santo e com poder. Ele andou por toda parte, fazendo o bem e curando todos os que eram dominados pelo diabo, porque Deus estava com ele.
            <br /><br />
            <sup>39</sup>E nós somos testemunhas de tudo o que ele fez na terra dos judeus e em Jerusalém. Eles o mataram, suspendendo-o num madeiro. <sup>40</sup>Mas Deus o ressuscitou no terceiro dia e permitiu que aparecesse, <sup>41</sup>não a todo o povo, mas às testemunhas que Deus havia escolhido: a nós, que comemos e bebemos com ele, depois que ressuscitou dos mortos.
            <br /><br />
            <sup>42</sup>E nos mandou pregar ao povo e dar testemunho de que Deus o constituiu juiz dos vivos e dos mortos. <sup>43</sup>Dele todos os profetas dão testemunho: quem nele crê recebe o perdão dos pecados, por meio do seu nome."
          </span>
        </ReadingCard>

        <ReadingCard label="Salmo Responsorial" reference="Salmo 117 (118)">
          <span>
            <strong style={{ color: 'var(--accent)' }}>R: Este é o dia que o Senhor fez para nós: alegremo-nos e nele exultemos!</strong>
            <br /><br />
            Dai graças ao Senhor, porque ele é bom!<br />
            "Eterna é a sua misericórdia!"<br />
            A casa de Israel agora o diga:<br />
            "Eterna é a sua misericórdia!" <strong>R.</strong>
            <br /><br />
            A mão direita do Senhor fez maravilhas,<br />
            a mão direita do Senhor me levantou,<br />
            a mão direita do Senhor fez maravilhas! <strong>R.</strong>
            <br /><br />
            A pedra que os pedreiros rejeitaram,<br />
            tornou-se agora a pedra angular.<br />
            Pelo Senhor é que foi feito tudo isso:<br />
            que maravilha aos nossos olhos! <strong>R.</strong>
          </span>
        </ReadingCard>

        <ReadingCard label="Segunda Leitura" reference="Colossenses 3,1-4">
          <span>
            Irmãos: <sup>1</sup>Se ressuscitastes com Cristo, buscai as coisas do alto, onde Cristo está sentado à direita de Deus. <sup>2</sup>Pensai nas coisas do alto e não nas da terra. <sup>3</sup>Pois vós morrestes e a vossa vida está escondida, com Cristo, em Deus. <sup>4</sup>Quando Cristo, que é a vossa vida, se manifestar, então vós também sereis manifestados com ele na glória.
          </span>
        </ReadingCard>

        <ReadingCard label="Evangelho" reference="João 20,1-9" isGospel>
          <span>
            <sup>1</sup>No primeiro dia da semana, Maria Madalena foi ao túmulo de Jesus, bem de madrugada, quando ainda estava escuro, e viu que a pedra tinha sido retirada do túmulo.
            <br /><br />
            <sup>2</sup>Então ela saiu correndo e foi encontrar Simão Pedro e o outro discípulo, aquele que Jesus amava, e lhes disse: "Tiraram o Senhor do túmulo, e não sabemos onde o colocaram."
            <br /><br />
            <sup>3</sup>Saíram, então, Pedro e o outro discípulo e foram ao túmulo. <sup>4</sup>Os dois corriam juntos, mas o outro discípulo correu mais depressa que Pedro e chegou primeiro ao túmulo. <sup>5</sup>Inclinando-se, viu as faixas de linho no chão, mas não entrou.
            <br /><br />
            <sup>6</sup>Chegou também Simão Pedro, que vinha correndo atrás, e entrou no túmulo. Viu as faixas de linho deitadas no chão <sup>7</sup>e o pano que tinha sido colocado na cabeça de Jesus, não posto com as faixas, mas enrolado num lugar à parte.
            <br /><br />
            <sup>8</sup>Então entrou também o outro discípulo, que tinha chegado primeiro ao túmulo. Ele viu e acreditou. <sup>9</sup>De fato, eles ainda não tinham compreendido a Escritura, segundo a qual Jesus devia ressuscitar dos mortos.
          </span>
        </ReadingCard>

        <ReflectionCard
          text='"Ele viu e acreditou." — O discípulo amado não precisou de explicações. Bastou ver o túmulo vazio e os sinais deixados. A fé nasce da contemplação atenta. Nesta Páscoa, somos chamados a olhar com os olhos do coração e acreditar: Cristo venceu a morte.'
          author="Reflexão Verbum — Domingo de Páscoa"
        />

        <SaintCard
          monogram="DP"
          name="Domingo de Páscoa"
          description="A Ressurreição do Senhor é a maior festa do ano litúrgico. Celebramos que Cristo venceu a morte e abriu para nós as portas da vida eterna. Feliz Páscoa!"
        />

        <div style={{ height: 100 }} />
      </div>
    </>
  )
}
