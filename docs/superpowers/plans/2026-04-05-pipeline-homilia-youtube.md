# Pipeline Homilia YouTube → Verbum — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pipeline Python automatizado que extrai homilias diárias do YouTube (Canal Capela Sh) e integra áudio real, transcrição e vídeo embed no protótipo HTML do Verbum.

**Architecture:** Script Python (`pipeline_homilia.py`) extrai metadados via RSS/oEmbed, transcrição via legendas automáticas (yt-dlp), e áudio MP3 (yt-dlp + ffmpeg). Gera arquivos JSON + MP3 estáticos que o HTML consome via `fetch()`. GitHub Actions roda o pipeline diariamente e faz push automático; Vercel redeploya.

**Tech Stack:** Python 3.12, yt-dlp, ffmpeg, GitHub Actions, Git LFS, Vercel (hosting estático)

**Spec:** `docs/superpowers/specs/2026-04-05-pipeline-homilia-youtube-design.md`

---

## File Structure

| Ação | Arquivo | Responsabilidade |
|------|---------|-----------------|
| Create | `pipeline/pipeline_homilia.py` | Script principal: RSS → oEmbed → legendas → áudio → JSON |
| Create | `pipeline/correcoes_liturgicas.json` | Dicionário de correções de termos litúrgicos |
| Create | `pipeline/requirements.txt` | Dependências Python (yt-dlp) |
| Create | `data/homilias-index.json` | Índice de todos os episódios |
| Create | `audio/.gitkeep` | Diretório para arquivos MP3 |
| Create | `.gitattributes` | Git LFS tracking para `audio/*.mp3` |
| Create | `.github/workflows/homilia.yml` | GitHub Actions cron workflow |
| Modify | `liturgia-app (1).html` | Integrar player real + botões vídeo/transcrição + feed de episódios |

---

## Chunk 1: Pipeline Python

### Task 1: Setup — Diretórios, dependências, Git LFS

**Files:**
- Create: `pipeline/requirements.txt`
- Create: `pipeline/correcoes_liturgicas.json`
- Create: `audio/.gitkeep`
- Create: `data/.gitkeep`
- Create: `.gitattributes`

- [ ] **Step 1: Criar diretórios e arquivos base**

```
pipeline/
data/
audio/
```

- [ ] **Step 2: Criar `pipeline/requirements.txt`**

```
yt-dlp>=2025.1.0
```

- [ ] **Step 3: Criar `pipeline/correcoes_liturgicas.json`**

```json
{
  "gentêmano": "Getsêmani",
  "getêmano": "Getsêmani",
  "getsemane": "Getsêmani",
  "umilia": "homilia",
  "eucarístico": "eucarístico"
}
```

- [ ] **Step 4: Criar `.gitattributes` para Git LFS**

```
audio/*.mp3 filter=lfs diff=lfs merge=lfs -text
```

- [ ] **Step 5: Inicializar Git LFS**

```bash
git lfs install
git lfs track "audio/*.mp3"
```

- [ ] **Step 6: Criar `data/.gitkeep`, `audio/.gitkeep` e `pipeline/__init__.py`**

Arquivos vazios para preservar diretórios no Git e permitir import do módulo.

- [ ] **Step 7: Criar seed `data/homilias-index.json`**

```json
{
  "last_updated": null,
  "episodes": []
}
```

Evita 404 no primeiro load do HTML antes do pipeline rodar.

- [ ] **Step 8: Commit**

```bash
git add pipeline/requirements.txt pipeline/correcoes_liturgicas.json pipeline/__init__.py .gitattributes data/.gitkeep data/homilias-index.json audio/.gitkeep
git commit -m "chore: setup pipeline directories, dependencies, and Git LFS"
```

---

### Task 2: Módulo RSS — Descobrir vídeo mais recente

**Files:**
- Create: `pipeline/pipeline_homilia.py`

- [ ] **Step 1: Criar `pipeline/pipeline_homilia.py` com função `fetch_latest_video()`**

```python
#!/usr/bin/env python3
"""Pipeline: YouTube (Canal Capela Sh) → Verbum (JSON + MP3)."""

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen
from xml.etree import ElementTree

CHANNEL_ID = "UCVwy48yKP9nudhUIlIhpjhg"
RSS_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
OEMBED_URL = "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
AUDIO_DIR = BASE_DIR / "audio"


def fetch_latest_video():
    """Fetch the most recent video from the channel RSS feed.

    Returns dict with keys: video_id, title, published.
    Returns None if no video found.
    """
    ns = {"atom": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    xml_data = urlopen(RSS_URL, timeout=30).read()
    root = ElementTree.fromstring(xml_data)

    entry = root.find("atom:entry", ns)
    if entry is None:
        return None

    video_id = entry.find("yt:videoId", ns).text
    title = entry.find("atom:title", ns).text
    published = entry.find("atom:published", ns).text

    return {"video_id": video_id, "title": title, "published": published}
```

- [ ] **Step 2: Testar localmente**

```bash
cd /Users/demetriofreitas/verbum-app-1
source /tmp/ytdlp-env/bin/activate
python3 -c "from pipeline.pipeline_homilia import fetch_latest_video; print(fetch_latest_video())"
```

Expected: Dict com `video_id`, `title`, `published` do vídeo mais recente.

- [ ] **Step 3: Commit**

```bash
git add pipeline/pipeline_homilia.py
git commit -m "feat: add RSS feed parser for Capela Sh channel"
```

---

### Task 3: Módulo oEmbed — Extrair metadados

**Files:**
- Modify: `pipeline/pipeline_homilia.py`

- [ ] **Step 1: Adicionar função `fetch_oembed(video_id)`**

```python
def fetch_oembed(video_id):
    """Fetch video metadata from YouTube oEmbed API.

    Returns dict with keys: title, author_name, author_url, thumbnail_url.
    """
    url = OEMBED_URL.format(video_id=video_id)
    data = json.loads(urlopen(url, timeout=30).read())
    return {
        "title": data["title"],
        "author_name": data["author_name"],
        "author_url": data["author_url"],
        "thumbnail_url": data["thumbnail_url"],
    }
```

- [ ] **Step 2: Testar localmente**

```bash
python3 -c "from pipeline.pipeline_homilia import fetch_oembed; import json; print(json.dumps(fetch_oembed('tiSAwLS5YkA'), indent=2, ensure_ascii=False))"
```

Expected: JSON com título, autor, thumbnail.

- [ ] **Step 3: Commit**

```bash
git add pipeline/pipeline_homilia.py
git commit -m "feat: add oEmbed metadata extraction"
```

---

### Task 4: Parser de título — Extrair padre, data, dia litúrgico

**Files:**
- Modify: `pipeline/pipeline_homilia.py`

- [ ] **Step 1: Adicionar função `parse_title(title)`**

```python
TITLE_PATTERN = re.compile(r"^(.+?)\s*\|\s*(.+?)\s*\|\s*(\d{2}/\d{2}/\d{4})$")


def parse_title(title):
    """Parse Chapel Sh title format into structured data.

    Input:  'Homilia do Domingo da Ressurreição do Senhor | Pe. João Chagas | 05/04/2026'
    Output: {'liturgy_day': '...', 'priest': 'Pe. João Chagas', 'date': '2026-04-05'}

    Returns None if title doesn't match expected pattern.
    """
    match = TITLE_PATTERN.match(title)
    if not match:
        return None

    liturgy_day = match.group(1).replace("Homilia do ", "").replace("Homilia da ", "").replace("Homilia de ", "").strip()
    priest = match.group(2).strip()
    date_parts = match.group(3).split("/")
    date_iso = f"{date_parts[2]}-{date_parts[1]}-{date_parts[0]}"

    return {"liturgy_day": liturgy_day, "priest": priest, "date": date_iso}
```

- [ ] **Step 2: Testar localmente**

```bash
python3 -c "
from pipeline.pipeline_homilia import parse_title
print(parse_title('Homilia do Domingo da Ressurreição do Senhor | Pe. João Chagas | 05/04/2026'))
print(parse_title('Homilia da Vigília Pascal | Pe. João Chagas | 04/04/2026'))
"
```

Expected: Dicts com `liturgy_day`, `priest`, `date` corretos.

- [ ] **Step 3: Commit**

```bash
git add pipeline/pipeline_homilia.py
git commit -m "feat: add title parser for liturgy day, priest, and date"
```

---

### Task 5: Extração de legendas — Transcrição limpa

**Files:**
- Modify: `pipeline/pipeline_homilia.py`

- [ ] **Step 1: Adicionar função `extract_transcript(video_id)`**

```python
import subprocess
import tempfile


def extract_transcript(video_id):
    """Download auto-generated subtitles and clean into readable text.

    Returns dict with keys: plain_text, paragraphs, word_count.
    Returns None if subtitles are unavailable.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        output_path = os.path.join(tmpdir, "subs")
        result = subprocess.run(
            [
                "yt-dlp",

                "--write-auto-sub",
                "--sub-lang", "pt-orig,pt",
                "--sub-format", "srt",
                "--skip-download",
                "-o", output_path,
                f"https://www.youtube.com/watch?v={video_id}",
            ],
            capture_output=True,
            text=True,
        )

        # Find the downloaded subtitle file
        srt_file = None
        for f in Path(tmpdir).glob("*.srt"):
            srt_file = f
            break

        if srt_file is None:
            print(f"WARNING: No subtitles found for {video_id}", file=sys.stderr)
            return None

        srt_content = srt_file.read_text(encoding="utf-8")

    return clean_srt(srt_content)


def clean_srt(srt_content):
    """Clean SRT subtitle content into readable paragraphs.

    Removes timestamps, sequence numbers, duplicate lines, and annotations.
    Applies liturgical corrections.
    """
    # Load corrections dictionary
    corrections_path = Path(__file__).parent / "correcoes_liturgicas.json"
    corrections = {}
    if corrections_path.exists():
        corrections = json.loads(corrections_path.read_text(encoding="utf-8"))

    lines = srt_content.strip().split("\n")
    text_lines = []
    seen = set()

    for line in lines:
        line = line.strip()
        # Skip sequence numbers (just digits)
        if re.match(r"^\d+$", line):
            continue
        # Skip timestamp lines
        if re.match(r"^\d{2}:\d{2}:\d{2}", line):
            continue
        # Skip empty lines
        if not line:
            continue
        # Remove annotations like [música], [roncando]
        line = re.sub(r"\[.*?\]", "", line).strip()
        if not line:
            continue
        # Deduplicate
        if line not in seen:
            seen.add(line)
            text_lines.append(line)

    # Join into single text
    full_text = " ".join(text_lines)

    # Apply liturgical corrections
    for wrong, correct in corrections.items():
        full_text = full_text.replace(wrong, correct)

    # Split into paragraphs (~3-4 sentences each)
    sentences = re.split(r"(?<=[.!?])\s+", full_text)
    paragraphs = []
    current = []
    for sentence in sentences:
        current.append(sentence)
        if len(current) >= 3:
            paragraphs.append(" ".join(current))
            current = []
    if current:
        paragraphs.append(" ".join(current))

    word_count = len(full_text.split())

    return {"plain_text": full_text, "paragraphs": paragraphs, "word_count": word_count}
```

- [ ] **Step 2: Testar localmente**

```bash
source /tmp/ytdlp-env/bin/activate
python3 -c "
from pipeline.pipeline_homilia import extract_transcript
import json
result = extract_transcript('tiSAwLS5YkA')
print(f'Words: {result[\"word_count\"]}')
print(f'Paragraphs: {len(result[\"paragraphs\"])}')
print(result['paragraphs'][0][:200])
"
```

Expected: Word count ~400-500, multiple paragraphs, clean text without timestamps.

- [ ] **Step 3: Commit**

```bash
git add pipeline/pipeline_homilia.py
git commit -m "feat: add subtitle extraction and SRT cleaning with liturgical corrections"
```

---

### Task 6: Extração de áudio — MP3

**Files:**
- Modify: `pipeline/pipeline_homilia.py`

- [ ] **Step 1: Adicionar função `extract_audio(video_id, output_path)`**

```python
def extract_audio(video_id, output_path):
    """Download audio from YouTube video and convert to MP3 128kbps.

    Args:
        video_id: YouTube video ID
        output_path: Path to save the MP3 file

    Returns:
        dict with keys: duration_seconds, size_kb. None on failure.
    """
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    result = subprocess.run(
        [
            "yt-dlp",
            "--extract-audio",
            "--audio-format", "mp3",
            "--audio-quality", "128K",
            "-o", str(output_path.with_suffix(".%(ext)s")),
            f"https://www.youtube.com/watch?v={video_id}",
        ],
        capture_output=True,
        text=True,
    )

    # yt-dlp may add extension, find the actual file
    mp3_file = output_path.with_suffix(".mp3")
    if not mp3_file.exists():
        # Try without extension change
        for f in output_path.parent.glob(f"{output_path.stem}.*"):
            if f.suffix == ".mp3":
                mp3_file = f
                break

    if not mp3_file.exists():
        print(f"ERROR: MP3 not created for {video_id}", file=sys.stderr)
        return None

    # Rename to expected path if needed
    if mp3_file != output_path:
        mp3_file.rename(output_path)

    size_kb = output_path.stat().st_size // 1024

    # Get duration via ffprobe
    try:
        probe = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(output_path)],
            capture_output=True, text=True,
        )
        duration = int(float(probe.stdout.strip()))
    except (ValueError, FileNotFoundError):
        duration = 0

    return {"duration_seconds": duration, "size_kb": size_kb}
```

- [ ] **Step 2: Testar localmente**

```bash
source /tmp/ytdlp-env/bin/activate
python3 -c "
from pipeline.pipeline_homilia import extract_audio
result = extract_audio('tiSAwLS5YkA', '/tmp/test-homilia.mp3')
print(result)
"
ls -lh /tmp/test-homilia.mp3
```

Expected: Dict com `duration_seconds` (~254) e `size_kb` (~3000-5000). MP3 file exists.

- [ ] **Step 3: Commit**

```bash
git add pipeline/pipeline_homilia.py
git commit -m "feat: add audio extraction to MP3 128kbps"
```

---

### Task 7: Orquestrador — main() junta tudo

**Files:**
- Modify: `pipeline/pipeline_homilia.py`

- [ ] **Step 1: Adicionar função `build_homilia_json()` e `update_index()` e `main()`**

```python
def build_homilia_json(video_id, oembed, parsed_title, transcript, audio_info, date_str):
    """Build the full homilia JSON structure per spec."""
    return {
        "date": date_str,
        "liturgy": {
            "day": parsed_title["liturgy_day"] if parsed_title else oembed["title"],
            "season": None,
            "color": None,
        },
        "video": {
            "id": video_id,
            "title": oembed["title"],
            "embed_url": f"https://www.youtube.com/embed/{video_id}",
            "thumbnail": oembed["thumbnail_url"],
            "duration_seconds": audio_info["duration_seconds"] if audio_info else 0,
        },
        "priest": {
            "name": parsed_title["priest"] if parsed_title else oembed["author_name"],
            "channel": oembed["author_name"],
            "channel_url": oembed["author_url"],
        },
        "audio": {
            "file": f"audio/homilia-{date_str}.mp3",
            "duration_seconds": audio_info["duration_seconds"] if audio_info else 0,
            "size_kb": audio_info["size_kb"] if audio_info else 0,
        } if audio_info else None,
        "transcript": transcript,
        "source": {
            "channel_id": CHANNEL_ID,
            "extracted_at": datetime.now(timezone.utc).isoformat(),
            "subtitle_lang": "pt-orig",
            "subtitle_type": "auto-generated",
        },
    }


def update_index(date_str, title, priest, duration):
    """Add episode to homilias-index.json, keeping newest first."""
    index_path = DATA_DIR / "homilias-index.json"

    if index_path.exists():
        index = json.loads(index_path.read_text(encoding="utf-8"))
    else:
        index = {"last_updated": None, "episodes": []}

    # Check if date already in index
    if any(ep["date"] == date_str for ep in index["episodes"]):
        return

    index["episodes"].insert(0, {
        "date": date_str,
        "title": title,
        "priest": priest,
        "duration": duration,
    })

    # Keep only last 30
    index["episodes"] = index["episodes"][:30]
    index["last_updated"] = datetime.now(timezone.utc).isoformat()

    index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")


def cleanup_old_audio(keep_days=30):
    """Delete MP3 files older than keep_days."""
    for mp3 in AUDIO_DIR.glob("homilia-*.mp3"):
        try:
            file_date = mp3.stem.replace("homilia-", "")
            file_dt = datetime.strptime(file_date, "%Y-%m-%d")
            age_days = (datetime.now() - file_dt).days
            if age_days > keep_days:
                mp3.unlink()
                print(f"Deleted old audio: {mp3.name}")
        except ValueError:
            continue


def main():
    """Main pipeline: fetch latest video, extract content, save JSON + MP3."""
    today = datetime.now().strftime("%Y-%m-%d")
    json_path = DATA_DIR / f"homilia-{today}.json"

    # Idempotency: skip if already processed today
    if json_path.exists():
        print(f"Already processed: {json_path.name}")
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    # Step 1: Fetch latest video from RSS
    print("Fetching RSS feed...")
    video = fetch_latest_video()
    if video is None:
        print("No video found in RSS feed")
        return

    video_id = video["video_id"]
    print(f"Latest video: {video['title']} ({video_id})")

    # Step 2: Parse title and determine target date
    parsed = parse_title(video["title"])
    target_date = parsed["date"] if parsed else today

    # Re-check idempotency with the actual target date
    target_json = DATA_DIR / f"homilia-{target_date}.json"
    if target_json.exists():
        print(f"Already processed: homilia-{target_date}.json")
        return

    # Step 3: Fetch oEmbed metadata
    print("Fetching oEmbed metadata...")
    oembed = fetch_oembed(video_id)

    # Step 4: Extract transcript
    print("Extracting transcript...")
    transcript = extract_transcript(video_id)

    # Step 5: Extract audio
    mp3_path = AUDIO_DIR / f"homilia-{today}.mp3"
    print(f"Extracting audio to {mp3_path}...")
    audio_info = extract_audio(video_id, mp3_path)

    # Step 6: Build and save JSON
    date_str = parsed["date"] if parsed else today
    homilia = build_homilia_json(video_id, oembed, parsed, transcript, audio_info, date_str)

    json_path = DATA_DIR / f"homilia-{date_str}.json"
    json_path.write_text(json.dumps(homilia, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved: {json_path.name}")

    # Step 7: Update index
    title_short = parsed["liturgy_day"] if parsed else oembed["title"]
    priest = parsed["priest"] if parsed else oembed["author_name"]
    duration = audio_info["duration_seconds"] if audio_info else 0
    update_index(date_str, title_short, priest, duration)
    print("Index updated")

    # Step 8: Cleanup old audio
    cleanup_old_audio()

    print("Pipeline complete!")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Rodar pipeline completo localmente**

```bash
source /tmp/ytdlp-env/bin/activate
cd /Users/demetriofreitas/verbum-app-1
python3 pipeline/pipeline_homilia.py
```

Expected: Cria `data/homilia-2026-04-05.json`, `audio/homilia-2026-04-05.mp3`, `data/homilias-index.json`.

- [ ] **Step 3: Validar outputs**

```bash
cat data/homilia-2026-04-05.json | python3 -m json.tool | head -30
cat data/homilias-index.json | python3 -m json.tool
ls -lh audio/homilia-2026-04-05.mp3
```

Expected: JSON válido com todos os campos da spec, MP3 de 3-5MB.

- [ ] **Step 4: Testar idempotência (rodar de novo)**

```bash
python3 pipeline/pipeline_homilia.py
```

Expected: `Already processed: homilia-2026-04-05.json` — sem reprocessar.

- [ ] **Step 5: Commit**

```bash
git add pipeline/pipeline_homilia.py
git commit -m "feat: add main orchestrator with idempotency and index management"
```

---

## Chunk 2: Integração HTML

### Task 8: Adicionar elemento `<audio>` real e botões Vídeo/Transcrição

**Files:**
- Modify: `liturgia-app (1).html` (seção audio-player, ~linhas 5142-5173)

- [ ] **Step 1: Adicionar `<audio>` hidden e containers para vídeo/transcrição**

Após o `audio-player-full` existente (linha 5173), adicionar:

```html
    <!-- Audio element real -->
    <audio id="homilia-audio" preload="metadata"></audio>

    <!-- Thumbnail da homilia -->
    <div class="homilia-thumb-container" id="homilia-thumb-container" onclick="toggleVideoEmbed()" style="display:none">
      <img id="homilia-thumb" class="homilia-thumb" alt="Thumbnail da homilia">
      <div class="homilia-thumb-play">
        <span class="material-symbols-rounded">play_circle</span>
      </div>
    </div>

    <!-- Video embed (expandível) -->
    <div class="homilia-video-container" id="homilia-video-container" style="display:none">
      <iframe id="homilia-iframe" width="100%" height="220" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>

    <!-- Transcrição (expandível) -->
    <div class="homilia-transcript" id="homilia-transcript" style="display:none">
      <div class="homilia-transcript-text" id="homilia-transcript-text"></div>
    </div>

    <!-- Botões Vídeo / Transcrição -->
    <div class="homilia-actions" id="homilia-actions" style="display:none">
      <button class="homilia-action-btn" onclick="toggleVideoEmbed()">
        <span class="material-symbols-rounded">smart_display</span>
        Vídeo
      </button>
      <button class="homilia-action-btn" onclick="toggleTranscript()">
        <span class="material-symbols-rounded">description</span>
        Ler transcrição
      </button>
    </div>

    <!-- Feed de episódios anteriores -->
    <div class="homilia-feed" id="homilia-feed" style="display:none">
      <div class="homilia-feed-title">Homilias anteriores</div>
      <div class="homilia-feed-scroll" id="homilia-feed-scroll"></div>
    </div>
```

- [ ] **Step 2: Commit**

```bash
git add "liturgia-app (1).html"
git commit -m "feat: add audio element, video embed, transcript, and feed containers"
```

---

### Task 9: CSS para novos componentes

**Files:**
- Modify: `liturgia-app (1).html` (seção `<style>`, após `.audio-player-full` styles ~linha 4700)

- [ ] **Step 1: Adicionar estilos para thumbnail, vídeo embed, transcrição e feed**

```css
/* Homilia Thumbnail */
.homilia-thumb-container {
  position: relative;
  margin: 0 16px 12px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}
.homilia-thumb {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
}
.homilia-thumb-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.6);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.homilia-thumb-play span { font-size: 36px; }

/* Video embed */
.homilia-video-container {
  margin: 0 16px 12px;
  border-radius: 12px;
  overflow: hidden;
}
.homilia-video-container iframe {
  border-radius: 12px;
}

/* Transcript */
.homilia-transcript {
  margin: 0 16px 16px;
  padding: 16px;
  background: var(--card-bg, #f8f5f0);
  border-radius: 12px;
  max-height: 400px;
  overflow-y: auto;
}
.homilia-transcript-text {
  font-family: var(--font-reading, 'Cormorant Garamond', serif);
  font-size: 17px;
  line-height: 1.8;
  color: var(--text-primary, #2c1810);
}
.homilia-transcript-text p {
  margin-bottom: 16px;
  text-indent: 1.5em;
}

/* Action buttons */
.homilia-actions {
  display: flex;
  gap: 10px;
  padding: 0 16px 16px;
}
.homilia-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1.5px solid var(--border-color, #d4c5b0);
  border-radius: 10px;
  background: transparent;
  color: var(--text-primary, #2c1810);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.homilia-action-btn.active {
  background: var(--accent-color, #8B4513);
  color: #fff;
  border-color: var(--accent-color, #8B4513);
}
.homilia-action-btn span { font-size: 20px; }

/* Episode feed */
.homilia-feed {
  padding: 0 16px 20px;
}
.homilia-feed-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary, #8B7355);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.homilia-feed-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
}
.homilia-feed-scroll::-webkit-scrollbar { height: 0; }

.homilia-episode-card {
  min-width: 100px;
  padding: 10px 12px;
  background: var(--card-bg, #f8f5f0);
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  border: 1.5px solid transparent;
}
.homilia-episode-card.active {
  border-color: var(--accent-color, #8B4513);
}
.homilia-episode-card:hover {
  transform: translateY(-2px);
}
.homilia-ep-date {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary, #2c1810);
}
.homilia-ep-title {
  font-size: 11px;
  color: var(--text-secondary, #8B7355);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
}
.homilia-ep-duration {
  font-size: 11px;
  color: var(--text-secondary, #8B7355);
  margin-top: 4px;
}
```

- [ ] **Step 2: Commit**

```bash
git add "liturgia-app (1).html"
git commit -m "feat: add CSS for homilia thumbnail, video, transcript, and episode feed"
```

---

### Task 10: JavaScript — Carregar homilia do JSON e conectar player real

**Files:**
- Modify: `liturgia-app (1).html` (seção AUDIO PLAYER, ~linhas 7734-7860)

- [ ] **Step 1: Substituir o player simulado pelo player real**

Substituir toda a seção `// =================== AUDIO PLAYER ===================` (linhas 7734-7860 aproximadamente) pelo código abaixo.

**NOTA DE SEGURANÇA:** A transcrição vem de legendas automáticas do YouTube (conteúdo controlado, não input de usuário). Mesmo assim, usamos criação segura de DOM (`document.createElement`, `textContent`) em vez de `innerHTML` para os textos. O `innerHTML` só é usado para o embed do YouTube (iframe com src controlado por nós).

```javascript
// =================== AUDIO PLAYER (REAL) ===================
let homiliaAudio = null;
let currentHomiliaDate = null;

async function loadHomilia(date) {
  if (!date) {
    const today = new Date();
    date = today.toISOString().split('T')[0];
  }

  try {
    const resp = await fetch('data/homilia-' + date + '.json');
    if (!resp.ok) {
      // Try yesterday if today's not available
      if (date === new Date().toISOString().split('T')[0]) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return loadHomilia(yesterday.toISOString().split('T')[0]);
      }
      console.warn('No homilia for ' + date);
      return;
    }

    const data = await resp.json();
    currentHomiliaDate = date;
    renderHomilia(data);
    loadHomiliaFeed();
  } catch (err) {
    console.error('Failed to load homilia:', err);
  }
}

function renderHomilia(data) {
  // Update title and subtitle
  const titleEl = document.querySelector('.audio-title');
  const subtitleEl = document.querySelector('.audio-subtitle');
  if (titleEl) titleEl.textContent = data.liturgy && data.liturgy.day ? data.liturgy.day : data.video.title;
  if (subtitleEl) {
    const dur = formatDuration(data.audio ? data.audio.duration_seconds : (data.video.duration_seconds || 0));
    subtitleEl.textContent = data.priest.name + ' \u00B7 ' + data.priest.channel + ' \u00B7 ' + dur;
  }

  // Set audio source (remove old listeners to prevent accumulation on episode switch)
  homiliaAudio = document.getElementById('homilia-audio');
  if (homiliaAudio && data.audio && data.audio.file) {
    // Clone and replace to remove all old event listeners
    var newAudio = homiliaAudio.cloneNode(false);
    homiliaAudio.parentNode.replaceChild(newAudio, homiliaAudio);
    homiliaAudio = newAudio;

    homiliaAudio.src = data.audio.file;
    homiliaAudio.load();

    homiliaAudio.addEventListener('loadedmetadata', function() {
      document.getElementById('apf-duration').textContent = formatDuration(homiliaAudio.duration);
    });

    homiliaAudio.addEventListener('timeupdate', updateAudioProgress);
    homiliaAudio.addEventListener('ended', function() {
      playing = false;
      document.getElementById('apf-play').textContent = 'play_arrow';
    });
  }

  // Show thumbnail
  var thumbContainer = document.getElementById('homilia-thumb-container');
  var thumbImg = document.getElementById('homilia-thumb');
  if (thumbContainer && data.video.thumbnail) {
    thumbImg.src = data.video.thumbnail;
    thumbContainer.style.display = 'block';
  }

  // Store video embed URL
  if (thumbContainer) thumbContainer.dataset.embedUrl = data.video.embed_url;

  // Prepare transcript using safe DOM methods
  var transcriptText = document.getElementById('homilia-transcript-text');
  if (transcriptText && data.transcript && data.transcript.paragraphs) {
    transcriptText.textContent = ''; // Clear existing
    data.transcript.paragraphs.forEach(function(text) {
      var p = document.createElement('p');
      p.textContent = text;
      transcriptText.appendChild(p);
    });
  }

  // Show action buttons and feed
  var actions = document.getElementById('homilia-actions');
  var feed = document.getElementById('homilia-feed');
  if (actions) actions.style.display = 'flex';
  if (feed) feed.style.display = 'block';

  // Update duration display
  var durationEl = document.getElementById('apf-duration');
  if (durationEl) {
    durationEl.textContent = formatDuration(data.audio ? data.audio.duration_seconds : (data.video.duration_seconds || 0));
  }
}

function formatDuration(seconds) {
  var min = Math.floor(seconds / 60);
  var sec = Math.floor(seconds % 60);
  return min + ':' + (sec < 10 ? '0' : '') + sec;
}

// ---- Player controls (now using real <audio>) ----
var playing = false;
var audioSpeed = 1;

function togglePlay(btn) {
  if (!homiliaAudio || !homiliaAudio.src) {
    showToast('Carregando áudio...');
    return;
  }

  playing = !playing;
  btn.textContent = playing ? 'pause' : 'play_arrow';

  if (playing) {
    homiliaAudio.play();
  } else {
    homiliaAudio.pause();
  }
}

function updateAudioProgress() {
  if (!homiliaAudio || !homiliaAudio.duration) return;

  var progress = (homiliaAudio.currentTime / homiliaAudio.duration) * 100;
  var fill = document.getElementById('apf-fill');
  var thumb = document.getElementById('apf-thumb');
  var currentTime = document.getElementById('apf-current');

  if (fill) fill.style.width = progress + '%';
  if (thumb) thumb.style.left = progress + '%';
  if (currentTime) currentTime.textContent = formatDuration(homiliaAudio.currentTime);
}

function seekAudio(e) {
  if (!homiliaAudio || !homiliaAudio.duration) return;
  var track = document.getElementById('apf-track');
  var rect = track.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var pct = Math.max(0, Math.min(1, x / rect.width));
  homiliaAudio.currentTime = pct * homiliaAudio.duration;
}

function skipAudio(seconds) {
  if (!homiliaAudio) return;
  homiliaAudio.currentTime = Math.max(0, Math.min(homiliaAudio.duration || 0, homiliaAudio.currentTime + seconds));
  if (navigator.vibrate) navigator.vibrate(10);
}

function cycleAudioSpeed() {
  var panel = document.getElementById('apf-speed-options');
  panel.classList.toggle('open');
  document.getElementById('apf-speed').classList.toggle('open');
}

function setAudioSpeed(speed) {
  audioSpeed = speed;
  if (homiliaAudio) homiliaAudio.playbackRate = speed;

  var label = speed === 1 ? '1x' : speed + 'x';
  document.getElementById('apf-speed').textContent = label;

  document.querySelectorAll('.apf-speed-opt').forEach(function(b) {
    b.classList.toggle('active', parseFloat(b.dataset.speed) === speed);
  });

  document.getElementById('apf-speed-options').classList.remove('open');
  document.getElementById('apf-speed').classList.remove('open');

  showToast('Velocidade: ' + label);
}

// ---- Video embed toggle ----
function toggleVideoEmbed() {
  var videoContainer = document.getElementById('homilia-video-container');
  var thumbContainer = document.getElementById('homilia-thumb-container');
  var iframe = document.getElementById('homilia-iframe');
  var btn = document.querySelector('.homilia-action-btn');

  if (videoContainer.style.display === 'none') {
    // Show video, hide thumb — iframe src is controlled by us (YouTube embed URL from our JSON)
    iframe.src = thumbContainer.dataset.embedUrl + '?autoplay=1';
    videoContainer.style.display = 'block';
    thumbContainer.style.display = 'none';
    if (btn) btn.classList.add('active');
    // Pause audio
    if (homiliaAudio && playing) {
      homiliaAudio.pause();
      playing = false;
      document.getElementById('apf-play').textContent = 'play_arrow';
    }
  } else {
    // Hide video, show thumb
    iframe.src = '';
    videoContainer.style.display = 'none';
    thumbContainer.style.display = 'block';
    if (btn) btn.classList.remove('active');
  }
}

// ---- Transcript toggle ----
function toggleTranscript() {
  var transcript = document.getElementById('homilia-transcript');
  var btns = document.querySelectorAll('.homilia-action-btn');
  var btn = btns[1]; // Second button

  if (transcript.style.display === 'none') {
    transcript.style.display = 'block';
    if (btn) btn.classList.add('active');
  } else {
    transcript.style.display = 'none';
    if (btn) btn.classList.remove('active');
  }
}

// ---- Episode feed (safe DOM creation) ----
async function loadHomiliaFeed() {
  try {
    var resp = await fetch('data/homilias-index.json');
    if (!resp.ok) return;
    var index = await resp.json();

    var scroll = document.getElementById('homilia-feed-scroll');
    if (!scroll) return;

    // Clear existing cards
    scroll.textContent = '';

    index.episodes.forEach(function(ep) {
      var dateParts = ep.date.split('-');
      var dateLabel = dateParts[2] + '/' + dateParts[1];
      var isActive = ep.date === currentHomiliaDate;

      var card = document.createElement('div');
      card.className = 'homilia-episode-card' + (isActive ? ' active' : '');
      card.onclick = function() { loadHomilia(ep.date); };

      var dateDiv = document.createElement('div');
      dateDiv.className = 'homilia-ep-date';
      dateDiv.textContent = dateLabel;

      var titleDiv = document.createElement('div');
      titleDiv.className = 'homilia-ep-title';
      titleDiv.textContent = ep.title;

      var durDiv = document.createElement('div');
      durDiv.className = 'homilia-ep-duration';
      durDiv.textContent = formatDuration(ep.duration);

      card.appendChild(dateDiv);
      card.appendChild(titleDiv);
      card.appendChild(durDiv);
      scroll.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load feed:', err);
  }
}

// ---- Init: load today's homilia ----
document.addEventListener('DOMContentLoaded', function() {
  loadHomilia();
});
```

- [ ] **Step 2: Testar no browser**

Abrir `liturgia-app (1).html` no browser. Verificar:
- Thumbnail aparece
- Botão play toca o MP3 real
- Progress bar atualiza com o tempo real
- Skip +/-10s funciona
- Velocidade funciona
- Botão Vídeo expande iframe do YouTube
- Botão Transcrição expande texto
- Feed de episódios aparece (se houver mais de 1 no index)

- [ ] **Step 3: Commit**

```bash
git add "liturgia-app (1).html"
git commit -m "feat: integrate real audio player with YouTube homilia data"
```

---

## Chunk 3: GitHub Actions

### Task 11: Workflow de automação

**Files:**
- Create: `.github/workflows/homilia.yml`

- [ ] **Step 1: Criar workflow**

```yaml
name: Pipeline Homilia Diária

on:
  schedule:
    # 7h BRT (10h UTC)
    - cron: '0 10 * * *'
    # 9h BRT (12h UTC) — fallback
    - cron: '0 12 * * *'
    # 15h BRT (18h UTC) — último fallback
    - cron: '0 18 * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  extract-homilia:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          lfs: true

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: |
          pip install -r pipeline/requirements.txt
          sudo apt-get update && sudo apt-get install -y ffmpeg

      - name: Run pipeline
        run: python pipeline/pipeline_homilia.py

      - name: Check for changes
        id: changes
        run: |
          git add data/ audio/
          if git diff --cached --quiet; then
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
          fi

      - name: Commit and push
        if: steps.changes.outputs.changed == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git commit -m "feat(homilia): add homilia $(date +%Y-%m-%d)"
          git push

      - name: Notify on failure
        if: failure()
        run: echo "::error::Pipeline homilia falhou! Verifique os logs."
```

O GitHub Actions envia email automático de falha para o dono do repo quando um workflow falha.

- [ ] **Step 2: Commit**

```bash
mkdir -p .github/workflows
git add .github/workflows/homilia.yml
git commit -m "feat: add GitHub Actions workflow for daily homilia pipeline"
```

---

### Task 12: Rodar pipeline completo e validar end-to-end

- [ ] **Step 1: Garantir que yt-dlp e ffmpeg estão disponíveis**

```bash
source /tmp/ytdlp-env/bin/activate
which ffmpeg || brew install ffmpeg
```

- [ ] **Step 2: Rodar pipeline**

```bash
cd /Users/demetriofreitas/verbum-app-1
python3 pipeline/pipeline_homilia.py
```

- [ ] **Step 3: Validar JSON gerado**

```bash
python3 -c "
import json
data = json.load(open('data/homilia-2026-04-05.json'))
assert data['date'] == '2026-04-05'
assert data['video']['id'] == 'tiSAwLS5YkA'
assert data['priest']['name'] is not None
assert data['audio'] is not None
assert data['transcript'] is not None
print('All assertions passed!')
"
```

- [ ] **Step 4: Validar MP3**

```bash
ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 audio/homilia-2026-04-05.mp3
ls -lh audio/homilia-2026-04-05.mp3
```

Expected: Duration > 0, file size 2-6 MB.

- [ ] **Step 5: Abrir HTML no browser e testar player real**

```bash
open "liturgia-app (1).html"
```

Verificar: áudio toca, thumbnail aparece, transcript expande, video embed funciona.

- [ ] **Step 6: Commit final**

```bash
git add data/ audio/ .gitattributes
git commit -m "feat: add initial homilia data for 2026-04-05 (Domingo da Ressurreição)"
```
