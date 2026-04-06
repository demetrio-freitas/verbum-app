# Verbum — Migração HTML → React PWA + Capacitor (APK)

**Data:** 5 de Abril de 2026
**Status:** Aprovado
**Abordagem:** React 19 + Vite + React Router + Capacitor

---

## Objetivo

Transformar os protótipos HTML do Verbum em um app React real que:
1. Funcione como PWA (instalável, offline, push notifications)
2. Gere APK via Capacitor para a Google Play Store
3. Mantenha 100% do design visual dos protótipos
4. Unifique todos os HTMLs separados (biblia, catecismo, lectio, igrejas, etc.) em um único app com roteamento

## Stack

| Tecnologia | Papel |
|-----------|-------|
| React 19 | UI components |
| Vite 6 | Bundler + dev server |
| React Router 7 | Roteamento client-side |
| vite-plugin-pwa | Service worker + manifest PWA |
| Capacitor 6 | Empacotamento Android/iOS |
| CSS puro (variables) | Design system (reutilizado dos protótipos) |

## Arquivos fonte (protótipos HTML)

| Arquivo | Linhas | Destino React |
|---------|--------|--------------|
| liturgia.html | 10.026 | Home + Missa + Terço + Orações + Exame + Notificações + Calendário + Paróquia + Settings |
| biblia.html | 1.826 | /biblia |
| catecismo-prototype.html | 1.648 | /catecismo |
| lectio-divina.html | 713 | /lectio |
| igrejas.html | 736 | /igrejas |
| onboarding.html | 805 | /onboarding |
| boa-noite-prototype.html | 1.847 | /boa-noite |
| terco-opcoes-prototype.html | 1.504 | /terco |

## Estrutura do projeto

```
verbum-app/
├── public/
│   ├── icons/
│   └── data/               # JSONs estáticos
├── src/
│   ├── styles/
│   │   ├── tokens.css      # CSS variables (cores, sombras, raios, tipografia)
│   │   ├── themes.css      # 5 temas + dark mode
│   │   ├── layout.css      # Header, BottomNav, MoreMenu
│   │   └── components.css  # Todos os estilos de componentes
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   ├── MoreMenu.jsx
│   │   │   └── AppLayout.jsx
│   │   ├── Leituras/
│   │   ├── Missa/
│   │   ├── Terco/
│   │   ├── Oracoes/
│   │   ├── Exame/
│   │   ├── Notificacoes/
│   │   └── shared/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── data/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── capacitor.config.ts
└── package.json
```

## Roteamento

| Rota | Página | Bottom Nav? |
|------|--------|------------|
| / | Home (Leituras) | Sim — aba "Leituras" |
| /missa | Folheto Digital | Sim — aba "Missa" |
| /terco | Terço (opções + interativo) | Sim — aba "Terço" |
| /oracoes | Orações | Sim — aba "Orações" |
| /biblia | Bíblia Sagrada | Menu Mais |
| /catecismo | Catecismo | Menu Mais |
| /lectio | Lectio Divina | Menu Mais |
| /igrejas | Igrejas Perto de Mim | Menu Mais |
| /boa-noite | Histórias para Dormir | Menu Mais |
| /exame | Exame de Consciência | Menu Mais |
| /notificacoes | Notificações | Menu Mais / Settings |
| /calendario | Calendário Litúrgico | Menu Mais |
| /paroquia | Minha Paróquia | Menu Mais |
| /settings | Configurações | Menu Mais |
| /onboarding | Onboarding (1x) | Não |

## Migração do CSS

O design system inteiro é reutilizado:
1. Extrair `:root` variables → `tokens.css`
2. Extrair `[data-visual="..."]` e `[data-theme="dark"]` → `themes.css`
3. Extrair estilos de componentes → `components.css` ou por módulo
4. Manter Material Symbols Rounded via Google Fonts CDN

## Estado global

| Estado | Escopo | Persistência |
|--------|--------|-------------|
| Tema visual (clássico/serenidade/jovem/etc) | Global | localStorage |
| Dark mode | Global | localStorage |
| Font scale | Global | localStorage |
| Onboarding completo | Global | localStorage |
| Exame de consciência (checkboxes) | Página | Não persiste (privacidade) |
| Modo Missa ativo | Página | Não persiste |

## PWA

- Manifest com nome "Verbum", ícones, theme_color
- Service Worker via vite-plugin-pwa (Workbox)
- Cache: App shell + fontes + ícones Material Symbols
- Offline: Conteúdo estático funciona 100% offline

## Capacitor (APK)

- Após PWA validada: `npx cap init` + `npx cap add android`
- Build: `npm run build` → `npx cap sync` → Android Studio → APK
- Plugins nativos futuros: StatusBar, SplashScreen, LocalNotifications

## Ordem de migração

1. Setup projeto (Vite + React + Router + PWA config)
2. Design system (CSS tokens + temas + dark mode)
3. Layout shell (Header + BottomNav + MoreMenu + roteamento)
4. Home/Leituras (maior e mais complexa)
5. Missa (Folheto Digital + Modo Missa)
6. Demais páginas (Terço, Orações, Exame, Notificações...)
7. HTMLs separados (Bíblia, Catecismo, Lectio, Igrejas, Boa Noite)
8. PWA final (manifest, icons, service worker)
9. Capacitor (Android)
