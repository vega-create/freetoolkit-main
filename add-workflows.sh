#!/bin/bash
# =============================================================
# 自動為所有 repos 新增 Cloudflare Pages deploy workflow
# 用法: bash add-workflows.sh
# 前置需求: gh CLI 已登入 (gh auth login)
# =============================================================

set -e

REPOS=(
  ft-calc
  ft-password
  ft-convert
  ft-text
  ft-pdf
  ft-qr
  ft-color
  ft-image
  ft-json
  ft-seo
  ft-social
  ft-random
  ft-healthtools
  ft-financetools
  ft-time
  biblegrace-freshblogs
  freshblogs-main
  vega-note
  bible_tw
  mommystartup
)

OWNER="vega-create"

generate_workflow() {
  local project_name="$1"
  cat << 'EOF'
name: Deploy to Cloudflare Pages
on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build site
        run: npm run build
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
EOF
  echo "          command: pages deploy dist --project-name=${project_name}"
}

echo "========================================="
echo " Adding Cloudflare Pages deploy workflow"
echo " to ${#REPOS[@]} repos under ${OWNER}"
echo "========================================="
echo ""

SUCCESS=0
FAIL=0
SKIP=0

for repo in "${REPOS[@]}"; do
  echo "--- ${repo} ---"

  # Check if repo exists
  if ! gh api "repos/${OWNER}/${repo}" --silent 2>/dev/null; then
    echo "  ❌ Repo not found, skipping"
    FAIL=$((FAIL + 1))
    echo ""
    continue
  fi

  # Check if workflow already exists
  if gh api "repos/${OWNER}/${repo}/contents/.github/workflows/deploy.yml" --silent 2>/dev/null; then
    echo "  ⏭️  deploy.yml already exists, skipping"
    SKIP=$((SKIP + 1))
    echo ""
    continue
  fi

  # Also remove old scheduled-publish.yml if it exists
  OLD_SHA=$(gh api "repos/${OWNER}/${repo}/contents/.github/workflows/scheduled-publish.yml" --jq '.sha' 2>/dev/null || true)
  if [ -n "$OLD_SHA" ]; then
    echo "  🗑️  Removing old scheduled-publish.yml..."
    gh api "repos/${OWNER}/${repo}/contents/.github/workflows/scheduled-publish.yml" \
      --method DELETE \
      --field message="ci: remove old scheduled-publish workflow" \
      --field sha="${OLD_SHA}" \
      --field branch="main" --silent 2>/dev/null || true
  fi

  # Create deploy.yml
  CONTENT=$(generate_workflow "${repo}" | base64 -w 0)

  if gh api "repos/${OWNER}/${repo}/contents/.github/workflows/deploy.yml" \
    --method PUT \
    --field message="ci: add Cloudflare Pages deploy workflow" \
    --field content="${CONTENT}" \
    --field branch="main" --silent 2>/dev/null; then
    echo "  ✅ deploy.yml created successfully"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "  ❌ Failed to create deploy.yml"
    FAIL=$((FAIL + 1))
  fi
  echo ""
done

echo "========================================="
echo " Done!"
echo " ✅ Success: ${SUCCESS}"
echo " ⏭️  Skipped: ${SKIP}"
echo " ❌ Failed:  ${FAIL}"
echo "========================================="
