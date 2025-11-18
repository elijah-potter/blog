#!/usr/bin/env bash
set -euo pipefail

repo_root="$(pwd)"
articles_file="$repo_root/posts/articles.ts"

if [[ ! -f "$articles_file" ]]; then
	echo "posts/articles.ts not found from $repo_root" >&2
	exit 1
fi

if [[ $# -lt 1 ]]; then
	echo "Usage: $0 <path-to-markdown>" >&2
	exit 1
fi

article_path="$1"
shift
article_path="${article_path/#\~/$HOME}"
article_path="$(realpath "$article_path")"

if [[ ! -f "$article_path" ]]; then
	echo "Markdown file not found at $article_path" >&2
	exit 1
fi
if [[ ! -f "$article_path" ]]; then
	echo "Markdown file not found at $article_path" >&2
	exit 1
fi

slug="$(basename "$article_path" .md)"
key="${slug//-/_}"

read -rp "Short description for the article: " description

if [[ -z "${description// /}" ]]; then
	echo "Description is required" >&2
	exit 1
fi

read -rp "Publication date (YYYY-MM-DD, defaults to today): " pub_date

if [[ -z "$pub_date" ]]; then
	pub_date="$(date +%Y-%m-%d)"
fi

read -rp "Image path to use in articles.ts (leave empty for null): " image_path

read -rp "Comma-separated keywords: " keywords_input

if [[ -z "${keywords_input// /}" ]]; then
	echo "At least one keyword is required" >&2
	exit 1
fi

read -rp "Mark as featured? (y/N): " featured_input

featured_flag="false"
if [[ "$featured_input" =~ ^[Yy] ]]; then
	featured_flag="true"
fi

base64_encode() {
	printf "%s" "$1" | base64 | tr -d '\n'
}

description_b64="$(base64_encode "$description")"
keywords_b64="$(base64_encode "$keywords_input")"

python3 - "$articles_file" "$key" "$description_b64" "$image_path" "$pub_date" "$featured_flag" "$keywords_b64" <<'PY'
import base64
import json
import sys
from pathlib import Path

if len(sys.argv) != 8:
    raise SystemExit("Unexpected python arguments")

_, articles_path, key, desc_b64, image_path, pub_date, featured_flag, keywords_b64 = sys.argv

try:
    description = base64.b64decode(desc_b64).decode("utf-8")
    keywords_raw = base64.b64decode(keywords_b64).decode("utf-8")
except Exception as exc:
    raise SystemExit(f"Failed to decode metadata: {exc}") from exc

keywords = [keyword.strip() for keyword in keywords_raw.split(",") if keyword.strip()]
if not keywords:
    raise SystemExit("No keywords provided after parsing input")

month_day = pub_date.split("-")
if len(month_day) != 3 or not all(part.isdigit() for part in month_day):
    raise SystemExit("Publication date must be in YYYY-MM-DD format")

year, month, day = map(int, month_day)
if not 1 <= month <= 12:
    raise SystemExit("Month must be between 1 and 12")

month_index = month - 1

date_expression = f"new Date({year}, {month_index}, {day}).toUTCString()"

articles = Path(articles_path)
content = articles.read_text()

if f"{key}:" in content:
    raise SystemExit(f"Key '{key}' already exists in {articles_path}")

marker = "const postDeclarations"
marker_index = content.find(marker)
if marker_index == -1:
    raise SystemExit("Could not find postDeclarations declaration")

brace_index = content.find("{", marker_index)
if brace_index == -1:
    raise SystemExit("Could not find opening brace for postDeclarations")

depth = 1
i = brace_index + 1
while depth > 0 and i < len(content):
    ch = content[i]
    if ch == "{":
        depth += 1
    elif ch == "}":
        depth -= 1
    i += 1

if depth != 0:
    raise SystemExit("Mismatched braces in articles.ts")

insert_index = i - 1

image_literal = "null" if not image_path.strip() else json.dumps(image_path)
description_literal = json.dumps(description)

entry_lines = [
    f"\t{key}: {{",
    f"\t\tpubDate: {date_expression},",
    f"\t\tdescription: {description_literal},",
    f"\t\timage: {image_literal},",
    "\t\tkeywords: ["
]

for keyword in keywords:
    entry_lines.append(f"\t\t\t{json.dumps(keyword)},")

entry_lines.append("\t\t],")
if featured_flag.lower() == "true":
    entry_lines.append("\t\tfeatured: true,")

entry_lines.append("\t},")
entry = "\n".join(entry_lines)

new_content = content[:insert_index] + "\n" + entry + "\n" + content[insert_index:]
articles.write_text(new_content)
print(f"Added '{key}' to {articles_path}")
PY
