# Pipeline Homilia YouTube → Verbum

**Data:** 2026-04-05
**Status:** Aprovado (design)
**Autor:** Demétrio + Claude
**Prioridade:** Alta — Feature 11.1 do PRD v2.0

---

## 1. Problema

O player de homilia no Verbum é simulado (sem áudio real). O canal Capela Sh (@capelash) publica homilias diárias no YouTube, mas o usuário precisa sair do app para assistir. Queremos trazer esse conteúdo para dentro do Verbum automaticamente.

## 2. Solução

Pipeline automatizado que extrai de cada vídeo do Canal Capela Sh:
- **Áudio MP3** — para o player nativo do Verbum (experiência principal)
- **Transcrição** — texto limpo a partir das legendas automáticas do YouTube
- **Vídeo embed** — iframe do YouTube como opção secundária

O usuário abre o Verbum e ouve a homilia do dia no player de áudio. Se quiser, expande o vídeo ou lê a transcrição.

## 3. Contexto e Decisões

| Decisão | Escolha | Razão |
|---------|---------|-------|
| Fonte de conteúdo | Canal Capela Sh (terceiros) | Autorização verbal/escrita obtida |
| Experiência principal | Áudio-first | Público ouve no trânsito |
| Automação | Cron diário, 100% automático | Zero trabalho manual |
| Stack | Python script + arquivos estáticos | Funcionar rápido no protótipo HTML atual |
| Hospedagem | Vercel (redeploy automático no push) | Rápido, gratuito |

## 4. Pipeline de Extração

### Componente: `pipeline/pipeline_homilia.py`

```
Cron 7h BRT
    │
    ▼
[1] RSS Feed do canal (sem API key)
    https://www.youtube.com/feeds/videos.xml?channel_id=UCVwy48yKP9nudhUIlIhpjhg
    → Pega vídeo mais recente (publicações ~02h UTC / 23h BRT do dia anterior)
    │
    ▼
[2] oEmbed API (metadados)
    → Título, thumbnail, padre, data
    │
    ▼
[3] yt-dlp (legendas automáticas pt-orig)
    → Baixa SRT → limpa timestamps → deduplica
    → Remove marcações [música], [roncando]
    → Aplica dicionário de correções litúrgicas
    → Gera texto corrido + array de parágrafos
    │
    ▼
[4] yt-dlp + ffmpeg (áudio)
    → Extrai stream de áudio → MP3 128kbps
    → ~3-5MB por homilia de 5min
    │
    ▼
[OUTPUT]
    data/homilia-YYYY-MM-DD.json
    audio/homilia-YYYY-MM-DD.mp3
    data/homilias-index.json (atualizado)
```

### Dependências

- `yt-dlp` — extração de legendas e áudio do YouTube
- `ffmpeg` — conversão de áudio para MP3 128kbps
- Python stdlib (`xml.etree`, `json`, `re`, `urllib`) — parsing RSS/JSON

### Tratamento da transcrição

| Problema | Solução |
|----------|---------|
| Timestamps sobrepostos no SRT | Removidos no parsing |
| Palavras duplicadas entre segmentos | Deduplicação por overlap |
| Marcações `[música]`, `[roncando]` | Regex remove `\[.*?\]` |
| Erros litúrgicos ("gentêmano" → "Getsêmani") | Dicionário `correcoes_liturgicas.json` — cresce manualmente |

### Extração de metadados do título

O canal Capela Sh segue um padrão consistente no título:
```
"Homilia do Domingo da Ressurreição do Senhor | Pe. João Chagas | 05/04/2026"
```

O pipeline parseia com regex: `(.+?) \| (.+?) \| (\d{2}/\d{2}/\d{4})`
- Grupo 1 → `video.title` e `liturgy.day`
- Grupo 2 → `priest.name`
- Grupo 3 → `date`

O campo `liturgy.season` e `liturgy.color` são derivados de um mapa estático de datas litúrgicas do ano (baseado no Computus/calendário litúrgico que o Verbum já calcula). Se não houver match, ficam como `null`.

### Idempotência

Antes de processar, o pipeline verifica se `data/homilia-YYYY-MM-DD.json` já existe. Se existir, pula o processamento (exit 0). Isso garante que:
- Os dois crons (7h e 9h) não dupliquem
- `workflow_dispatch` manual não reprocesse
- Para forçar reprocessamento, deletar o JSON antes de rodar

### Fallback

- **Cron primário:** 7h BRT (10h UTC)
- **Cron secundário:** 9h BRT (12h UTC) — se o vídeo ainda não estava no ar
- **Cron terciário:** 15h BRT (18h UTC) — último fallback do dia
- **Sem vídeo no dia:** app mostra homilia do dia anterior
- **Legendas indisponíveis:** gera JSON sem campo `transcript`, mantém áudio e vídeo

## 5. Estrutura de Dados

### Arquivo diário: `data/homilia-YYYY-MM-DD.json`

```json
{
  "date": "2026-04-05",
  "liturgy": {
    "day": "Domingo da Ressurreição do Senhor",
    "season": "Páscoa",
    "color": "#FFFFFF"
  },
  "video": {
    "id": "tiSAwLS5YkA",
    "title": "Homilia do Domingo da Ressurreição do Senhor",
    "embed_url": "https://www.youtube.com/embed/tiSAwLS5YkA",
    "thumbnail": "https://i.ytimg.com/vi/tiSAwLS5YkA/hqdefault.jpg",
    "duration_seconds": 254
  },
  "priest": {
    "name": "Pe. João Chagas",
    "channel": "Capela Sh",
    "channel_url": "https://www.youtube.com/@capelash"
  },
  "audio": {
    "file": "audio/homilia-2026-04-05.mp3",
    "duration_seconds": 254,
    "size_kb": 3900
  },
  "transcript": {
    "plain_text": "O Evangelho de São João...",
    "paragraphs": [
      "O Evangelho de São João, que nós acabamos de ler...",
      "Isso é um também um desejo do evangelista..."
    ],
    "word_count": 487
  },
  "source": {
    "channel_id": "UCVwy48yKP9nudhUIlIhpjhg",
    "extracted_at": "2026-04-05T07:00:12Z",
    "subtitle_lang": "pt-orig",
    "subtitle_type": "auto-generated"
  }
}
```

### Arquivo índice: `data/homilias-index.json`

```json
{
  "last_updated": "2026-04-05T07:00:12Z",
  "episodes": [
    {
      "date": "2026-04-05",
      "title": "Domingo da Ressurreição",
      "priest": "Pe. João Chagas",
      "duration": 254
    }
  ]
}
```

### Estrutura de pastas

```
verbum-app-1/
├── data/
│   ├── homilias-index.json
│   ├── homilia-2026-04-05.json
│   └── ...
├── audio/
│   ├── homilia-2026-04-05.mp3
│   └── ...
├── pipeline/
│   ├── pipeline_homilia.py
│   ├── correcoes_liturgicas.json
│   └── requirements.txt
├── .github/
│   └── workflows/
│       └── homilia.yml
└── liturgia-app (1).html
```

## 6. Integração com o HTML

### UX: Áudio-first com expansão

O player existente no HTML (`.audio-player-full`) já tem controles de play, seek, skip ±10s e velocidade. A integração consiste em:

1. **No init da página** → `fetch('data/homilia-YYYY-MM-DD.json')`
2. **Preencher UI** → título, padre, duração, thumbnail
3. **Setar `<audio src>`** → apontar para `audio/homilia-YYYY-MM-DD.mp3`
4. **Conectar controles existentes** ao elemento `<audio>` real

### Layout

```
┌─────────────────────────────────────────┐
│  HOMILIA DO DIA                         │
│  Domingo da Ressurreição · Páscoa       │
├─────────────────────────────────────────┤
│  [Thumbnail clicável → expande vídeo]   │
│  Pe. João Chagas · Capela Sh · 4:14     │
│                                         │
│  ▶ ═══════════○──────────── 1:32        │
│  ⏪10   ▶ Play   ⏩10                   │
│  0.75x  1x  [1.25x]  1.5x  2x         │
├─────────────────────────────────────────┤
│  [📺 Vídeo]  [📝 Ler transcrição]      │
├─────────────────────────────────────────┤
│  Homilias anteriores                    │
│  [04/04] [04/03] [04/02] [04/01] >>>   │
└─────────────────────────────────────────┘
```

### Comportamento

| Ação | Resultado |
|------|-----------|
| Abrir seção | Carrega JSON do dia, mostra thumbnail + player parado |
| Play | Toca MP3 real. Controles de seek, skip, velocidade |
| Botão "Vídeo" | Expande iframe YouTube. Pausa o áudio |
| Botão "Ler transcrição" | Expande parágrafos com tipografia de leitura |
| Card de episódio anterior | Carrega JSON daquele dia, troca player |

### Feed de episódios

Scroll horizontal com últimos 30 dias, carregado do `homilias-index.json`. Cada card mostra data, título curto e duração.

## 7. Automação — GitHub Actions

### Workflow: `.github/workflows/homilia.yml`

- **Trigger:** cron `0 10 * * *` (7h BRT) + `0 12 * * *` (9h BRT) + `0 18 * * *` (15h BRT) + `workflow_dispatch`
- **Steps:**
  1. Checkout repo
  2. Setup Python 3.12 + instalar yt-dlp, ffmpeg
  3. Rodar `pipeline_homilia.py`
  4. Se houve mudanças: `git add` + `git commit` + `git push`
- **Se não há vídeo novo:** exit 0, sem commit

### Git LFS para áudio

MP3 binários no Git engordam o histórico. Usar Git LFS desde o dia 1:

```
# .gitattributes
audio/*.mp3 filter=lfs diff=lfs merge=lfs -text
```

GitHub LFS free tier: 1 GB storage + 1 GB bandwidth/mês. Suficiente para ~250 episódios.

### Limpeza automática

- MP3 com mais de 30 dias: deletados pelo pipeline (LFS libera storage)
- JSONs ficam para sempre (~5KB cada)
- Budget de storage: ~120 MB/mês, bem dentro do limite LFS gratuito

### Notificação de falhas

O workflow envia email automático do GitHub Actions em caso de falha (`if: failure()`). Opcionalmente, adicionar step de webhook para Slack/Discord no futuro.

### Deploy

- **Vercel** conectado ao repo `main`
- Push automático do GitHub Actions → Vercel detecta → redeploy em ~30s
- Arquivos estáticos (HTML + JSON + MP3) servidos via CDN global

## 8. Custos

| Recurso | Limite grátis | Uso estimado | Custo |
|---------|--------------|-------------|-------|
| GitHub Actions | 2.000 min/mês | ~30 min/mês | R$0 |
| GitHub Storage | 1 GB | ~120 MB/mês | R$0 |
| Vercel Hosting | 100 GB bandwidth | ~5 GB/mês | R$0 |
| YouTube RSS/oEmbed | Sem limite | 2 req/dia | R$0 |
| **Total** | | | **R$0/mês** |

## 9. Limitações conhecidas

| Limitação | Impacto | Mitigação |
|-----------|---------|-----------|
| Legendas automáticas têm erros | Transcrição ~95% precisa | Dicionário de correções + revisão manual opcional |
| Depende do Canal Capela Sh publicar | Sem vídeo = sem homilia nova | Fallback para dia anterior; futuro: múltiplas fontes |
| yt-dlp pode ser bloqueado pelo YouTube | Pipeline falha silenciosamente | Git LFS mitiga storage; `workflow_dispatch` para retry manual; monitorar e atualizar yt-dlp regularmente; fallback: embed-only (sem áudio extraído) |
| GitHub Actions usa IPs compartilhados | YouTube pode rate-limitar | Manter yt-dlp atualizado (releases frequentes); se necessário, migrar para self-hosted runner |
| Sem background audio (HTML, não nativo) | Áudio para se o browser fecha | Resolvido na migração para React Native |

## 10. Validação — Prova de conceito

Realizada em 2026-04-05 com o vídeo `tiSAwLS5YkA`:

- ✅ oEmbed retornou metadados completos (título, padre, thumbnail)
- ✅ yt-dlp extraiu legendas automáticas em pt-BR (5.58KB SRT)
- ✅ Transcrição limpa gerada com sucesso (~487 palavras)
- ✅ Áudio extraível (confirmado via `--list-subs`)
- ✅ RSS feed do canal acessível sem autenticação
