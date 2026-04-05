# Verbum — Funcionalidades: Folheto Digital da Missa

**Versão:** 1.0  
**Data:** 5 de Abril de 2026  
**Status:** Implementado (protótipo funcional)

---

## O que é o Folheto Digital?

O Folheto Digital da Missa é a versão no celular do folheto impresso que os fiéis usam para acompanhar a Santa Missa (como O Domingo, Paulus ou Vozes). Ele traz todas as orações, respostas e textos que o fiel precisa — tudo organizado na ordem em que aparecem na celebração.

**Objetivo principal:** Permitir que o usuário acompanhe a Missa inteira pelo celular, sem precisar de folheto de papel, sabendo exatamente quando e o que responder.

---

## Como o usuário acessa

- **Navegação principal:** Botão "Missa" na barra inferior do app (bottom-nav), sempre visível
- **Ícone:** Livro aberto (auto_stories)
- **Posição:** Segunda posição na barra, ao lado de "Leituras"

---

## Estrutura do Folheto

O folheto é dividido em **5 seções**, na mesma ordem da celebração:

### 1. Ritos Iniciais
Tudo que acontece no começo da Missa, antes das leituras.

| Momento | O que aparece | Tipo |
|---------|--------------|------|
| **Saudação** | Diálogo entre sacerdote e povo ("Em nome do Pai...") | Fixo — sempre igual |
| **Ato Penitencial** | Confiteor ("Confesso a Deus todo-poderoso...") | Variável — o padre escolhe 1 de 3 formas |
| **Senhor, tende piedade** | Kyrie — 3 invocações com resposta do povo | Fixo |
| **Glória** | Hino de louvor completo | Fixo (omitido no Advento/Quaresma) |
| **Oração do Dia (Coleta)** | Oração própria do dia litúrgico | Variável — muda todo dia |

### 2. Liturgia da Palavra
As leituras bíblicas do dia. O folheto **não duplica** esse conteúdo — ele linka para a seção "Leituras" que já existe no Verbum.

| Momento | O que aparece | Tipo |
|---------|--------------|------|
| **Link para Leituras** | Botão que leva às leituras completas (1ª Leitura, Salmo, 2ª Leitura, Evangelho) | Link interno |
| **Aclamação ao Evangelho** | "Aleluia!" + diálogo antes e depois do Evangelho | Fixo |
| **Homilia** | Indicação de que o padre faz a reflexão (sem texto) | Informativo |
| **Profissão de Fé (Creio)** | Texto completo do Credo Apostólico | Fixo |
| **Oração dos Fiéis** | Indicação da resposta do povo após cada prece | Variável |

### 3. Liturgia Eucarística
O coração da Missa — da apresentação das oferendas até a comunhão.

| Momento | O que aparece | Tipo |
|---------|--------------|------|
| **Apresentação das Oferendas** | Orações do pão e do vinho + resposta do povo | Fixo |
| **Prefácio** | Diálogo "O Senhor esteja convosco... Corações ao alto!" | Fixo |
| **Santo** | Hino "Santo, Santo, Santo..." | Fixo |
| **Oração Eucarística** | Narrativa da Instituição (consagração) + "Eis o mistério da fé!" | Fixo |
| **Pai Nosso** | Texto completo + embolismo | Fixo |
| **Saudação da Paz** | "A paz do Senhor esteja convosco" + resposta | Fixo |
| **Cordeiro de Deus** | "Cordeiro de Deus, que tirais o pecado do mundo..." | Fixo |
| **Comunhão** | "Eis o Cordeiro de Deus..." + resposta do povo | Fixo |

### 4. Ritos Finais
O encerramento da Missa.

| Momento | O que aparece | Tipo |
|---------|--------------|------|
| **Bênção Final** | Diálogo + bênção trinitária | Fixo |
| **Envio** | "Ide em paz e o Senhor vos acompanhe" + "Graças a Deus" | Fixo |

### 5. Cantos Sugeridos
Sugestões de canto para cada momento da Missa.

| Momento | Exemplo |
|---------|---------|
| **Entrada** | Exulte o céu de alegria |
| **Ofertório** | Ofertório pascal |
| **Comunhão** | Ressuscitou, aleluia! |
| **Final** | Vós sois a luz do mundo |

> Os cantos podem ser personalizados pela paróquia quando o Modo Paróquia estiver ativo (feature futura).

---

## Sistema de Marcação: Quem fala o quê

O maior diferencial do folheto digital é a marcação visual clara de **quem está falando**:

| Marcação | Significado | Visual |
|----------|------------|--------|
| **[S]** | Sacerdote — o que o padre diz | Tag âmbar/marrom, fonte normal |
| **[P]** | Povo — o que o fiel responde | Tag verde, fonte em negrito e maior |

**Por que isso importa:** Na missa, o fiel precisa identificar rapidamente "agora é minha vez de responder". As respostas do povo aparecem em destaque (negrito, cor verde) para que sejam encontradas num relance, mesmo de longe.

---

## Modo Missa

Funcionalidade especial que transforma o celular num "livro de missa" otimizado.

### O que o Modo Missa faz:

| Funcionalidade | O que acontece | Por quê |
|---------------|----------------|---------|
| **Tela sempre ligada** | O celular não desliga a tela sozinho | A missa dura ~1 hora; sem isso, a tela apaga a cada minuto |
| **Fonte ampliada** | Todos os textos ficam 15% maiores | Mais fácil de ler sem óculos ou de longe |
| **Respostas em destaque** | As respostas [P] ganham fundo verde | Encontrar sua fala num relance |
| **Header/nav discretos** | Barra superior e inferior ficam semi-transparentes | Mais espaço para o conteúdo da missa |
| **Aviso de silenciar** | Toast lembrando de colocar no silencioso | Evitar constrangimento na igreja |

### Como ativar:
1. Tocar em "Missa" na barra inferior
2. Tocar no botão "Ativar Modo Missa" (botão marrom no topo)
3. O botão fica com fundo sólido indicando que está ativo
4. Para desativar: tocar novamente no mesmo botão

### Desativação automática:
- Se o usuário sair da seção Missa (tocar em Leituras, Terço, etc.), o Modo Missa desativa sozinho

---

## Navegação dentro do Folheto

### Menu lateral de âncoras (sidebar direita)
Uma coluna de 5 botões circulares no lado direito da tela, cada um representando uma parte da Missa:

| Botão | Ícone | Destino |
|-------|-------|---------|
| 1 | Igreja | Ritos Iniciais |
| 2 | Livro | Liturgia da Palavra |
| 3 | Mesa | Liturgia Eucarística |
| 4 | Mão acenando | Ritos Finais |
| 5 | Nota musical | Cantos |

**Comportamento:**
- Aparece apenas quando a seção Missa está ativa
- Ao passar o mouse/tocar, mostra o nome da parte
- O botão da seção atual fica destacado (fundo marrom)
- Atualiza automaticamente conforme o usuário rola a página

### Botão flutuante "Próxima parte"
Botão arredondado fixo na parte inferior da tela (acima da barra de navegação).

**Comportamento:**
- Mostra o nome da próxima seção ("Liturgia da Palavra", "Liturgia Eucarística", etc.)
- Ao tocar, rola suavemente até a próxima parte
- Quando chega na última seção, mostra "Fim da Missa" com ícone de check
- Aparece apenas quando a seção Missa está ativa

---

## Conteúdo fixo vs. variável

| Tipo | Significado | Exemplos | Frequência de mudança |
|------|------------|----------|----------------------|
| **Fixo** | Sempre igual em qualquer Missa | Glória, Creio, Santo, Pai Nosso, Cordeiro | Nunca muda |
| **Variável** | Muda conforme o dia litúrgico | Oração do Dia, Leituras, Prefácio | Muda todo dia/semana |

O conteúdo variável é indicado visualmente por uma caixa dourada com ícone de informação, explicando que aquele trecho depende do calendário litúrgico.

---

## Rubricas (instruções em itálico)

Pequenos textos explicativos em itálico e cinza que orientam o que está acontecendo:
- *"O sacerdote faz o sinal da cruz e saúda o povo."*
- *"Breve pausa de silêncio."*
- *"O sacerdote eleva a hóstia consagrada."*

Elas ajudam quem não conhece bem a missa a entender o que está acontecendo naquele momento.

---

## Integrações com outras features do Verbum

| Integração | Como funciona |
|-----------|--------------|
| **Leituras do Dia** | Botão dentro da Liturgia da Palavra que leva às leituras completas |
| **Modo Paróquia** (futuro) | Cantos personalizados pela paróquia, horário da próxima missa no topo |
| **Calendário Litúrgico** (futuro) | Oração do dia e prefácio atualizados automaticamente |

---

## Resumo técnico simplificado

| Aspecto | Detalhe |
|---------|---------|
| **Onde fica no app** | Barra inferior > botão "Missa" |
| **Funciona offline?** | Sim — todo o conteúdo fixo é local |
| **Tamanho do conteúdo** | ~15KB de texto (leve) |
| **Tela sempre ligada** | Sim, via Wake Lock API (quando Modo Missa ativo) |
| **Precisa de internet?** | Não para o conteúdo fixo. Sim para conteúdo variável (leituras do dia) |

---

## Roadmap de evolução

| Fase | Melhoria | Impacto |
|------|---------|---------|
| **v2.1** | Conteúdo variável automático (Oração do Dia atualizada pelo calendário litúrgico) | Folheto 100% preciso por dia |
| **v2.2** | Integração Modo Paróquia (cantos da paróquia, forma do ato penitencial) | Personalização por comunidade |
| **v2.3** | Brilho reduzido automático (sensor de luz) | Não incomodar vizinhos na igreja |
| **v3.0** | Modo offline completo com pre-fetch de 7 dias | Funciona sem internet na igreja |

---

*Documento gerado em 5 de Abril de 2026 — Verbum v2.0 — 7BIS Startup Studio*
