# Histórias Bíblicas para Dormir — Design Spec

**Data:** 2026-04-05  
**Feature:** Seção "Boa Noite" — Histórias bíblicas narradas com sons ambiente para dormir  
**Status:** Aprovado (design)  
**Versão alvo:** v3.0

---

## Resumo

Seção "Boa Noite" no Verbum com catálogo de histórias bíblicas narradas (Salmos, Parábolas, AT, Santos Brasileiros, Sazonal) + player fullscreen imersivo com sons ambiente e timer de sono. Referência: Hallow Sleep Stories.

## Decisões de Design

| Decisão | Escolha | Alternativas descartadas |
|---|---|---|
| Fluxo principal | Catálogo → Player fullscreen | Experiência guiada, modo imersivo direto |
| Sons ambiente | Mixer simples (1 som pré-definido por história + slider volume) | Escolha de som, mixer multi-camada |
| Timer de sono | Presets fixos: 10, 15, 20, 30, 45, 60, ∞ com fade-out 2min | Slider contínuo, sem timer |
| Voz | Fixa por história (masculina ou feminina) | Toggle M/F, seção por narrador |
| Abordagem visual | Player fullscreen com transição animada | Player inline (Spotify), tela única scroll |

---

## 1. Catálogo "Boa Noite"

### Acesso
- Ícone de lua crescente no menu "Mais" (grid), label "Boa Noite"

### Header
- Fundo gradiente escuro (deep indigo → preto)
- Título "Boa Noite" em Cormorant Garamond, peso light, cor dourada suave
- Subtítulo "Descanse na Palavra de Deus" em DM Sans, cinza claro
- Decoração: lua + estrelas sutil

### Categorias (horizontal scroll chips)
Todas | Salmos | Parábolas | Antigo Testamento | Santos Brasileiros | Sazonal

### Cards de História (grid 2 colunas)
- Thumbnail com gradiente overlay
- Título da história
- Duração (ex: "14 min")
- Ícone do som ambiente associado
- Badge "Novo" / badge cadeado (Premium futuro)
- Estado: ouvido (check), em progresso (mini barra)

### "Continue ouvindo"
Card destacado no topo se existe história pausada, com barra de progresso.

### Paleta Noturna (forçada)
- Fundo: `#0A0A1A`
- Cards: `#151525`
- Accent dourado: `#D4A853`
- Tema escuro independente do tema global do app

---

## 2. Player Fullscreen

### Transição
Card expande com animação (scale + fade) para tela cheia. Botão "X" canto superior esquerdo.

### Layout (topo → baixo)

1. **Header mínimo**: Fechar (X) | Categoria à direita
2. **Artwork**: Círculo ~200px, borda dourada, glow, animação de pulso lento durante reprodução
3. **Info**: Título (Cormorant, dourado) + Subtítulo (DM Sans, cinza) + Tipo de voz (discreto)
4. **Controles de reprodução**: Barra progresso (dourado/cinza) + tempo | ◀-15s | ▶Play/Pause | ▶+15s | Chip velocidade (0.75x/1x/1.25x)
5. **Controles de sono**:
   - Som ambiente: Label + ícone + slider horizontal (0%–100%)
   - Timer: chips 10 · 15 · 20 · 30 · 45 · 60 · ∞ | chip ativo = dourado | countdown quando ativo
6. **Fundo**: Gradiente radial (indigo → preto) + ~15 estrelas animadas (opacity pulse)

---

## 3. Comportamentos

### Timer
- Independente da duração da história
- Timer < duração → fade-out aos N minutos
- Timer > duração → som ambiente continua até timer zerar
- Timer pausa com o áudio, retoma junto
- Fade-out: volume decai linearmente nos últimos 2 min

### Estados
- **Idle**: player fechado, catálogo visível
- **Playing**: áudio tocando, artwork pulsando, timer contando
- **Paused**: controles visíveis, artwork estática, timer pausado
- **Fading**: últimos 2 min, volume → 0, estrelas somem
- **Finished**: toast "Boa noite ✦" 3s, volta ao catálogo

### Persistência (localStorage)
- Última posição de cada história
- Último timer selecionado
- Último volume do ambiente

---

## 4. Modelo de Dados

```javascript
{
  id: "salmo-23",
  title: "Salmo 23",
  subtitle: "O Senhor é meu pastor, nada me faltará",
  category: "salmos",
  duration: 840,
  voice: "masculina",
  ambientSound: "riacho",
  ambientLabel: "Riacho",
  ambientIcon: "water_drop",
  thumbnail: "gradient-blue",
  isNew: true,
  isPremium: false
}
```

---

## 5. Conteúdo Inicial (6 histórias)

| Título | Categoria | Duração | Voz | Ambiente |
|---|---|---|---|---|
| Salmo 23 — O Bom Pastor | Salmos | 14 min | Masculina | Riacho |
| O Bom Samaritano | Parábolas | 12 min | Feminina | Noite no campo |
| A Criação do Mundo | Antigo Testamento | 18 min | Masculina | Chuva suave |
| Irmã Dulce — O Anjo Bom | Santos Brasileiros | 15 min | Feminina | Sinos de igreja |
| O Filho Pródigo | Parábolas | 11 min | Masculina | Lareira |
| Meditação do Advento | Sazonal | 10 min | Feminina | Cantos gregorianos |

---

## 6. Stack Técnica (Protótipo)

- HTML/CSS/JS vanilla (alinhado com app principal)
- Web Audio API para sons ambiente simulados (ruído filtrado, osciladores)
- setInterval para simulação de reprodução
- CSS animations para estrelas, pulso do artwork, transições
- localStorage para persistência
- Design system Verbum: Cormorant Garamond, DM Sans, Material Symbols

---

## 7. Monetização (Futuro)

- 5-10 histórias gratuitas, biblioteca completa via Premium
- Badge de cadeado nos cards Premium
- Não implementado no protótipo
