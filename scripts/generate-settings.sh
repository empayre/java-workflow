#!/usr/bin/env bash

set -euo pipefail

mkdir -p "$HOME/.m2"
SETTINGS_FILE="$HOME/.m2/settings.xml"

# Start settings.xml
cat > "$SETTINGS_FILE" <<EOF
<settings>
  <interactiveMode>false</interactiveMode>
  <servers>
    <server>
      <id>github</id>
      <username>${GITHUB_ACTOR}</username>
      <password>${GITHUB_TOKEN}</password>
    </server>
EOF

if [[ -n "${MAVEN_SERVER_READ_IDS:-}" ]]; then
  IFS=',' read -ra IDS <<< "$MAVEN_SERVER_READ_IDS"
  for id in "${IDS[@]}"; do
    cat >> "$SETTINGS_FILE" <<EOF
    <server>
      <id>${id}</id>
      <username>${GITHUB_PKG_RO_USER}</username>
      <password>${GITHUB_PKG_RO_PAT}</password>
    </server>
EOF
  done
fi

# Finish file
cat >> "$SETTINGS_FILE" <<EOF
  </servers>
  <mirrors/>
  <proxies/>
  <profiles/>
</settings>
EOF
