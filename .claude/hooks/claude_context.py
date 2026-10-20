"""Regenerate claudeContext.md: a readable log of every Claude Code session in this project."""
import json, re, glob, os, datetime

PROJECT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TRANSCRIPTS = os.path.expanduser("~/.claude/projects/" + re.sub(r"[^A-Za-z0-9]", "-", PROJECT))
OUT = os.path.join(PROJECT, "claudeContext.md")
NOISE = re.compile(r"<(system-reminder|ide_opened_file|ide_selection|command-[a-z]+|local-command-[a-z]+)>.*?</\1>", re.S)


def messages(path):
    for line in open(path, encoding="utf-8"):
        try:
            d = json.loads(line)
        except ValueError:
            continue
        if d.get("type") not in ("user", "assistant") or d.get("isMeta") or d.get("isSidechain") or d.get("isApiErrorMessage"):
            continue
        c = (d.get("message") or {}).get("content")
        if isinstance(c, list):
            c = "\n".join(b.get("text", "") for b in c if b.get("type") == "text")
        text = NOISE.sub("", c or "").strip()
        if text:
            yield d.get("type"), d.get("timestamp", ""), text


sessions = []
for path in glob.glob(os.path.join(TRANSCRIPTS, "*.jsonl")):
    msgs = list(messages(path))
    if any(t == "assistant" for t, _, _ in msgs):
        sessions.append((msgs[0][1], msgs))
sessions.sort()

out = ["# Claude Context — Daily Chow", "",
       f"_Auto-generated from Claude Code sessions. Last updated {datetime.datetime.now():%Y-%m-%d %H:%M}._", ""]
for i, (start, msgs) in enumerate(sessions, 1):
    out += [f"## Session {i} — {start[:16].replace('T', ' ')}", ""]
    for who, _, text in msgs:
        if who == "user":
            out += ["### 🧑 You", "", text, ""]
        else:
            out += ["**🤖 Claude:**", "", text, ""]
    out += ["---", ""]
open(OUT, "w", encoding="utf-8").write("\n".join(out))
