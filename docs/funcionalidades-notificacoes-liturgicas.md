# Verbum — Funcionalidades: Notificações Litúrgicas Inteligentes

**Versão:** 1.0  
**Data:** 5 de Abril de 2026  
**Status:** Implementado (protótipo funcional)

---

## Para a Dona Maria (65 anos): O que é isso?

Sabe quando a senhora esquece que amanhã é dia santo de guarda e precisa ir à Missa? Ou quando está fazendo uma novena e perde o dia 5 porque esqueceu?

Essa parte do Verbum manda **avisos no celular** pra lembrar a senhora das coisas importantes da Igreja. É como ter uma amiga que liga e diz: "Maria, amanhã é Corpus Christi, não esquece da Missa!"

A senhora escolhe **o que** quer ser lembrada (novenas, dias de preceito, santos...) e **quando** quer receber (de manhã, antes da Missa, ou à noite). Se achar que está recebendo demais, é só desligar um tipo ou reduzir o máximo por dia.

Tem também uma lista mostrando **as próximas datas importantes** — como um calendariozinho resumido com Semana Santa, festas de santos, e tudo mais.

---

## Para o Pedro (15 anos): O que é isso?

É tipo o sistema de notificações de qualquer app, mas ao invés de spam de promoção, você recebe lembretes úteis da Igreja.

Exemplo: se você está fazendo uma novena, o app te lembra todo dia ("Dia 3 de 9 — Novena do Espírito Santo"). Se amanhã é feriado religioso com Missa obrigatória, ele avisa na véspera.

Você configura tudo: quais tipos de lembrete quer, que horas receber, e o máximo por dia (pra não encher o saco). Tem 5 categorias e você liga/desliga cada uma com um switch.

O mais legal: tem uma lista de "próximas notificações" que funciona como um preview do que vem por aí — Semana Santa, festas de santos, etc.

---

## Como funciona — passo a passo

### Passo 1: Abrir as Notificações

Dois caminhos:
- **Configurações > Notificações Litúrgicas** (toque na seta)
- **Mais > Notificações** (no menu de baixo)

### Passo 2: Ver o status

No topo aparece uma barra colorida:
- **Verde:** "Notificações ativadas — X tipos ativos"
- **Vermelha:** "Notificações desativadas" (se todos os tipos estiverem desligados)

### Passo 3: Ver o exemplo

Antes de configurar, a senhora/você vê um **exemplo real** de como a notificação aparece no celular — com o ícone do Verbum, título, texto e horário. Assim sabe exatamente o que esperar.

### Passo 4: Escolher os tipos

São 5 categorias. Cada uma tem um switch (liga/desliga):

| Tipo | O que avisa | Quantas vezes | Exemplo |
|------|------------|---------------|---------|
| **Novenas** | Lembrete diário durante novena ativa | 1/dia durante 9 dias | "Dia 3/9 da Novena do Espírito Santo" |
| **Dias de Preceito** | Véspera de dias de Missa obrigatória | ~12 por ano | "Amanhã é Corpus Christi — dia de preceito" |
| **Tempos Litúrgicos** | Início de cada tempo da Igreja | ~8 por ano | "Hoje começa o Advento — 4 semanas até o Natal" |
| **Santos do Dia** | Solenidades e festas maiores | ~30 por ano | "Hoje: São Francisco de Assis — padroeiro da ecologia" |
| **Minha Paróquia** | Avisos do padre (Missa extra, eventos) | Máx 3/semana | "Missa extra quinta às 19h — Festa do Padroeiro" |

**Como ligar/desligar:** Toque no switch ao lado de cada tipo. Laranja = ligado. Cinza = desligado.

### Passo 5: Escolher o horário

Três opções (toque para selecionar):

| Opção | Horário | Para quem? |
|-------|---------|-----------|
| **Manhã** | 6h | Quem gosta de começar o dia com informação |
| **Pré-Missa** | 30 minutos antes da Missa | Quem quer o lembrete na hora certa |
| **Noite** | 20h | Quem prefere se preparar para o dia seguinte |

### Passo 6: Ajustar a frequência

Controle de **máximo de notificações por dia**:
- Mínimo: 1 por dia
- Máximo: 3 por dia (útil na Semana Santa, quando tem mais eventos)

Use os botões **+** e **−** para ajustar.

### Passo 7: Ver as próximas datas

No final da tela, uma lista mostra os **próximos eventos litúrgicos** com:
- Data (dia e mês)
- Nome do evento
- Tipo (badge colorido: Preceito, Tempo, Santo)

Exemplo do que aparece em Abril de 2026:

| Data | Evento | Tipo |
|------|--------|------|
| 13 Abr | Domingo de Ramos | Tempo |
| 17 Abr | Quinta-feira Santa | Preceito |
| 18 Abr | Sexta-feira Santa | Preceito |
| 20 Abr | Domingo de Páscoa | Tempo |
| 29 Abr | Santa Catarina de Sena | Santo |
| 01 Mai | São José Operário | Santo |

---

## O que cada botão faz

| Botão/Controle | O que faz |
|----------------|----------|
| Switch ao lado de cada tipo | Liga ou desliga aquele tipo de notificação |
| Manhã / Pré-Missa / Noite | Escolhe a que horas receber os avisos |
| **+** e **−** | Aumenta ou diminui o máximo de avisos por dia |

---

## Dúvidas comuns

**"Vai ficar mandando mensagem toda hora?"**  
Não! Você controla o máximo por dia (1, 2 ou 3). E cada tipo tem frequência natural — preceitos são só ~12 por ano.

**"Posso desligar tudo?"**  
Sim. Basta desligar todos os 5 switches. A barra fica vermelha mostrando que está tudo desligado.

**"O que é 'dia de preceito'?"**  
São dias em que a Igreja pede que todos os católicos participem da Missa. Exemplos: Natal, Corpus Christi, Imaculada Conceição, Assunção de Maria. No Brasil são cerca de 12 por ano.

**"O que é 'tempo litúrgico'?"**  
A Igreja divide o ano em períodos com significado especial: Advento (preparação pro Natal), Natal, Quaresma (preparação pra Páscoa), Páscoa, e Tempo Comum. Cada um tem cor e espírito próprio.

**"Preciso de internet pra receber?"**  
Para novenas, preceitos, tempos e santos: **não** — o calendário é calculado localmente. Para avisos da paróquia: **sim** — esses vêm do padre pelo painel admin.

**"Gasta bateria?"**  
Muito pouco. Os lembretes fixos são agendados localmente (não ficam consultando a internet). Só os da paróquia usam internet.

---

## Privacidade

| Pergunta | Resposta |
|----------|---------|
| Alguém sabe quais notificações eu ativei? | **Não.** As preferências ficam no seu celular. |
| O app rastreia se eu abri a notificação? | **Não.** Zero analytics sobre comportamento. |
| A paróquia sabe que eu recebo avisos dela? | **Não.** É como uma rádio — ela transmite, mas não sabe quem ouviu. |

---

*Documento gerado em 5 de Abril de 2026 — Verbum v2.0 — 7BIS Startup Studio*
