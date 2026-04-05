# Lectio Divina Guiada — Design Spec

**Projeto:** Verbum  
**Data:** 2026-04-05  
**Status:** Aprovado  
**Versão:** v1.0

---

## Resumo

Feature de oração contemplativa guiada em 4 etapas (Lectio, Meditatio, Oratio, Contemplatio) usando o Evangelho do dia. Reutiliza o Modo Foco existente como referência de padrão (wake lock, tela cheia) e o conteúdo litúrgico já disponível no app.

Acessada via menu "Mais" como nova rota `/lectio`.

---

## Problema

O Verbum já oferece as leituras do dia e um Modo Foco para leitura imersiva, mas não guia o usuário numa prática contemplativa estruturada. A Lectio Divina é uma das práticas mais antigas da Igreja (séc. XII, Guigo II) e segue 4 etapas bem definidas — ideal para uma experiência guiada no app.

---

## Fluxo do Usuário

### 1. Entrada (Tela Inicial)

- Usuário acessa via menu "Mais" > "Lectio Divina"
- Vê o Evangelho do dia (referência bíblica) e escolhe duração:
  - Rápida: 12 min (3-3-3-3)
  - Padrão: 20 min (5-5-5-5)
  - Profunda: 40 min (10-10-10-10)
- Toca "Iniciar"

### 2. Lectio (Leitura) — Etapa 1

- Evangelho do dia em tipografia contemplativa (fonte display, tamanho grande, line-height generoso)
- Instrução: "Leia lentamente. Pare no trecho que tocar seu coração."
- Timer countdown no header
- Barra de progresso: 4 segmentos, primeiro ativo
- Botão "Próxima etapa" (não força esperar o timer)

### 3. Meditatio (Meditação) — Etapa 2

- Card com o **versículo-chave do Evangelho** (`mockLiturgyDay.verse.text`) como trecho destacado (estilo quote com background accentSoft)
- Pergunta reflexiva: "O que esta palavra desperta em você hoje?"
- Campo de anotação (TextInput multilinha) para reflexão pessoal, dentro de KeyboardAvoidingView
- Timer countdown
- Botão "Próxima etapa"

### 4. Oratio (Oração) — Etapa 3

- Timer circular central (componente visual destacado)
- Prompt: "Senhor, o que queres de mim através desta Palavra?"
- Campo de anotação para oração pessoal
- Instrução: "Fale com Deus sobre o que meditou."
- Botão "Próxima etapa"

### 5. Contemplatio (Contemplação) — Etapa 4

- Tela minimalista — quase vazia
- Ponto pulsante animado (breathing dot)
- Texto: "Descanse na presença de Deus. Não é preciso pensar nem falar. Apenas esteja."
- Timer countdown
- Botão "Concluir"

### 6. Conclusão

- Mensagem: "Que a Palavra de hoje permaneça no seu coração."
- Stats: minutos de oração + dias seguidos de Lectio (calculado a partir de `useLectioStore.entries` — dias consecutivos com `completedAt`)
- Botões: "Ver diário" (futuro, desabilitado v1) e "Compartilhar" (share text: "Hoje fiz Lectio Divina com {referência} no Verbum. {duração} minutos com a Palavra de Deus.")
- Registra no streak geral via `useStreakStore.recordToday()`

---

## Arquitetura de Componentes

### Novos arquivos

| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `app/lectio.tsx` | Tela (rota) | Orquestra as 4 etapas, gerencia estado da sessão |
| `components/lectio/LectioEntry.tsx` | Componente | Tela de entrada — seleção de duração |
| `components/lectio/LectioStep.tsx` | Componente | Renderiza cada etapa com conteúdo variável |
| `components/lectio/LectioCompletion.tsx` | Componente | Tela de conclusão — stats e ações |
| `components/lectio/LectioTimer.tsx` | Componente | Timer circular com countdown visual |
| `components/lectio/LectioProgress.tsx` | Componente | Barra de progresso 4 segmentos |
| `stores/useLectioStore.ts` | Store (Zustand) | Diário de entradas + persistência local |

### Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `app/(tabs)/mais.tsx` | Adicionar item "Lectio Divina" (ícone `menu-book`) entre Novenas e Paróquia |

### Arquivos reutilizados (sem mudança)

| Arquivo | O que é usado |
|---|---|
| `lib/liturgy/mockData.ts` | Evangelho do dia (readings com isGospel: true) |
| `stores/useThemeStore.ts` | Cores e fontes do tema ativo |
| `stores/useStreakStore.ts` | Registro de streak (recordToday) |

---

## Store: useLectioStore

```typescript
interface LectioEntry {
  id: string;             // nanoid ou `${date}-${timestamp}`
  date: string;           // "2026-04-05"
  reference: string;      // "Mt 28,1-10"
  duration: number;       // 20 (minutos escolhidos)
  meditatio: string;      // Anotação da etapa 2
  oratio: string;         // Anotação da etapa 3
  completedAt: string;    // ISO timestamp
}

interface LectioState {
  entries: LectioEntry[];
  addEntry: (entry: Omit<LectioEntry, 'id'>) => void;
  getEntriesByDate: (date: string) => LectioEntry[];
  getLectioStreak: () => number;  // dias consecutivos com pelo menos 1 entry
}
```

**getLectioStreak:** Calcula dias consecutivos a partir de hoje/ontem percorrendo `entries` por data única (mesmo algoritmo de `useStreakStore.getCurrentStreak`, mas usando `entries.map(e => e.date)`).

**Múltiplas sessões por dia:** Permitidas. `getEntriesByDate` retorna array. O `id` é gerado como `${date}-${Date.now()}` (sem dependência nova).

**Persistência:** Zustand + `createJSONStorage(() => AsyncStorage)` — mesmo padrão de `useStreakStore`, `useRosaryStore`, etc.

**Migração futura para Supabase:** A interface do store não muda. Apenas a implementação interna de `addEntry` passará a sincronizar com Supabase além do AsyncStorage.

---

## Estado da Sessão (em app/lectio.tsx)

```typescript
type LectioPhase = 'entry' | 'lectio' | 'meditatio' | 'oratio' | 'contemplatio' | 'completion';

// Estado local (useState), não precisa de store
interface SessionState {
  phase: LectioPhase;
  durationMinutes: number;      // 12, 20, ou 40
  secondsPerStep: number;       // durationMinutes * 60 / 4
  meditatio: string;            // texto digitado
  oratio: string;               // texto digitado
  startedAt: Date | null;
}
```

---

## Timer

- Countdown por etapa (não global)
- Quando chega a zero: vibração suave (Haptics) + highlight no botão "Próxima etapa"
- O usuário pode avançar antes do timer acabar (não bloqueia)
- O usuário pode continuar após o timer acabar (não auto-avança)
- Usa `setInterval` com 1s de resolução. Cleanup no unmount.

---

## Dados do Evangelho

O evangelho é extraído de `mockLiturgyDay.readings` filtrando `isGospel: true`. Se não houver evangelho marcado, usa a última leitura como fallback.

```typescript
const gospel = mockLiturgyDay.readings.find(r => r.isGospel) 
  ?? mockLiturgyDay.readings[mockLiturgyDay.readings.length - 1];
```

---

## UX e Visual

### Padrões seguidos do Modo Foco

- `activateKeepAwakeAsync()` no mount, `deactivateKeepAwake()` no unmount
- Tela cheia (sem tabs)
- Botão fechar (X) no canto superior esquerdo — ao tocar, se houver texto nas anotações (meditatio/oratio), exibe Alert de confirmação ("Deseja sair? Suas anotações serão perdidas.") com "Cancelar" e "Sair". Se não houver texto, volta direto com `router.back()`
- Cores e fontes do `useThemeStore`

### Elementos visuais novos

- **Barra de progresso:** 4 segmentos horizontais (done = accent, active = accent, pending = bgElevated)
- **Timer circular:** Círculo com borda accent, número countdown centralizado
- **Ponto pulsante:** Animação CSS-like com `Animated` do React Native (scale + opacity, loop 3s)
- **Campo de anotação:** TextInput multilinha com borda sutil, placeholder em textTertiary, dentro de `KeyboardAvoidingView` (behavior="padding" iOS, "height" Android) para evitar que o teclado cubra o conteúdo

### Tipografia por etapa

| Etapa | Fonte do conteúdo principal | Tamanho |
|---|---|---|
| Lectio | fontDisplay (Cormorant Garamond) | 20px, lineHeight 34 |
| Meditatio | fontDisplay (itálico via quote) | 17px |
| Oratio | fontDisplay | 18px |
| Contemplatio | fontBody | 16px, cor textTertiary |

---

## Navegação

### Menu "Mais" — novo item

```
Notas
Salvos
Novenas
→ Lectio Divina  ← NOVO (ícone: menu-book)
Paróquia
Calendário
Configurações
```

### Rota

`app/lectio.tsx` — rota simples, acessada via `router.push('/lectio')`

---

## Fora do escopo (v1)

| Feature | Razão |
|---|---|
| Export PDF do diário | Complexidade desnecessária para v1 |
| Full-text search no diário | Poucas entradas inicialmente |
| Sino sonoro na Contemplatio | Requer expo-av já configurado para áudio |
| Tela dedicada de histórico/diário | Entradas ficam no store, UI de listagem vem depois |
| Seleção manual de trecho na Lectio | v1 usa o versículo-chave (`mockLiturgyDay.verse.text`) como trecho da Meditatio |
| Compartilhamento com imagem | Requer geração de imagem — futuro |

---

## Métricas de sucesso

- % de usuários que iniciam Lectio Divina: target > 15% dos DAU
- Taxa de conclusão (4 etapas): target > 60%
- Entradas no diário (Meditatio/Oratio preenchidos): target > 40% das sessões
- Streak de Lectio > 3 dias: target > 20% dos que iniciam

---

## Dependências

- `expo-keep-awake` (já instalado)
- `expo-haptics` (já instalado)
- `zustand` + `@react-native-async-storage/async-storage` (já instalados)
- `date-fns` (já instalado)
- Nenhuma dependência nova necessária

---

## Estimativa

- Implementação: ~1-2 dias
- 7 novos arquivos, 1 arquivo modificado
- Zero dependências novas
