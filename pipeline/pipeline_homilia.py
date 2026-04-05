#!/usr/bin/env python3
"""Pipeline: YouTube (Canal Capela Sh) → Verbum (JSON + MP3)."""

import json
import os
import re
import ssl
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen
from xml.etree import ElementTree

# Create SSL context — use certifi if available, then system certs, then unverified
# (GitHub Actions Ubuntu has proper certs; macOS Python often needs certifi)
def _make_ssl_context():
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        pass
    ctx = ssl.create_default_context()
    try:
        urlopen("https://www.youtube.com", timeout=5, context=ctx)
        return ctx
    except Exception:
        return ssl._create_unverified_context()

SSL_CONTEXT = _make_ssl_context()

CHANNEL_ID = "UCVwy48yKP9nudhUIlIhpjhg"
RSS_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
OEMBED_URL = "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
AUDIO_DIR = BASE_DIR / "audio"

TITLE_PATTERN = re.compile(r"^(.+?)\s*\|\s*(.+?)\s*\|\s*(\d{2}/\d{2}/\d{4})$")


# =================== RSS ===================

def fetch_latest_video():
    """Fetch the most recent video from the channel RSS feed.

    Returns dict with keys: video_id, title, published.
    Returns None if no video found.
    """
    ns = {"atom": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    xml_data = urlopen(RSS_URL, timeout=30, context=SSL_CONTEXT).read()
    root = ElementTree.fromstring(xml_data)

    entry = root.find("atom:entry", ns)
    if entry is None:
        return None

    video_id = entry.find("yt:videoId", ns).text
    title = entry.find("atom:title", ns).text
    published = entry.find("atom:published", ns).text

    return {"video_id": video_id, "title": title, "published": published}


# =================== oEmbed ===================

def fetch_oembed(video_id):
    """Fetch video metadata from YouTube oEmbed API.

    Returns dict with keys: title, author_name, author_url, thumbnail_url.
    """
    url = OEMBED_URL.format(video_id=video_id)
    data = json.loads(urlopen(url, timeout=30, context=SSL_CONTEXT).read())
    return {
        "title": data["title"],
        "author_name": data["author_name"],
        "author_url": data["author_url"],
        "thumbnail_url": data["thumbnail_url"],
    }


# =================== Title Parser ===================

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


# yt-dlp extra args for local dev (macOS SSL issues)
# GitHub Actions Ubuntu doesn't need this
YTDLP_EXTRA_ARGS = ["--no-check-certificates"] if os.environ.get("YTDLP_NO_CHECK_CERTS") else []


# =================== Transcript ===================

def extract_transcript(video_id):
    """Download auto-generated subtitles and clean into readable text.

    Returns dict with keys: plain_text, paragraphs, word_count.
    Returns None if subtitles are unavailable.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        output_path = os.path.join(tmpdir, "subs")
        subprocess.run(
            [
                "yt-dlp",
                *YTDLP_EXTRA_ARGS,
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
    """Clean SRT subtitle content into readable paragraphs."""
    corrections_path = Path(__file__).parent / "correcoes_liturgicas.json"
    corrections = {}
    if corrections_path.exists():
        corrections = json.loads(corrections_path.read_text(encoding="utf-8"))

    lines = srt_content.strip().split("\n")
    text_lines = []
    seen = set()

    for line in lines:
        line = line.strip()
        if re.match(r"^\d+$", line):
            continue
        if re.match(r"^\d{2}:\d{2}:\d{2}", line):
            continue
        if not line:
            continue
        line = re.sub(r"\[.*?\]", "", line).strip()
        if not line:
            continue
        if line not in seen:
            seen.add(line)
            text_lines.append(line)

    full_text = " ".join(text_lines)

    for wrong, correct in corrections.items():
        full_text = full_text.replace(wrong, correct)

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


# =================== Audio ===================

def extract_audio(video_id, output_path):
    """Download audio from YouTube video and convert to MP3 128kbps.

    Returns dict with keys: duration_seconds, size_kb. None on failure.
    """
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    subprocess.run(
        [
            "yt-dlp",
            *YTDLP_EXTRA_ARGS,
            "--extract-audio",
            "--audio-format", "mp3",
            "--audio-quality", "128K",
            "-o", str(output_path.with_suffix(".%(ext)s")),
            f"https://www.youtube.com/watch?v={video_id}",
        ],
        capture_output=True,
        text=True,
    )

    mp3_file = output_path.with_suffix(".mp3")
    if not mp3_file.exists():
        for f in output_path.parent.glob(f"{output_path.stem}.*"):
            if f.suffix == ".mp3":
                mp3_file = f
                break

    if not mp3_file.exists():
        print(f"ERROR: MP3 not created for {video_id}", file=sys.stderr)
        return None

    if mp3_file != output_path:
        mp3_file.rename(output_path)

    size_kb = output_path.stat().st_size // 1024

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


# =================== JSON Builder ===================

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


# =================== Index ===================

def update_index(date_str, title, priest, duration):
    """Add episode to homilias-index.json, keeping newest first."""
    index_path = DATA_DIR / "homilias-index.json"

    if index_path.exists():
        index = json.loads(index_path.read_text(encoding="utf-8"))
    else:
        index = {"last_updated": None, "episodes": []}

    if any(ep["date"] == date_str for ep in index["episodes"]):
        return

    index["episodes"].insert(0, {
        "date": date_str,
        "title": title,
        "priest": priest,
        "duration": duration,
    })

    index["episodes"] = index["episodes"][:30]
    index["last_updated"] = datetime.now(timezone.utc).isoformat()

    index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")


# =================== Cleanup ===================

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


# =================== Main ===================

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
    mp3_path = AUDIO_DIR / f"homilia-{target_date}.mp3"
    print(f"Extracting audio to {mp3_path}...")
    audio_info = extract_audio(video_id, mp3_path)

    # Step 6: Build and save JSON
    homilia = build_homilia_json(video_id, oembed, parsed, transcript, audio_info, target_date)

    target_json.write_text(json.dumps(homilia, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved: {target_json.name}")

    # Step 7: Update index
    title_short = parsed["liturgy_day"] if parsed else oembed["title"]
    priest = parsed["priest"] if parsed else oembed["author_name"]
    duration = audio_info["duration_seconds"] if audio_info else 0
    update_index(target_date, title_short, priest, duration)
    print("Index updated")

    # Step 8: Cleanup old audio
    cleanup_old_audio()

    print("Pipeline complete!")


if __name__ == "__main__":
    main()
