# GIA-BRIDALS — Working Notes

## Deployment
- Static site hosted on **GitHub Pages**, served from the **`main`** branch (custom domain via `CNAME`: giabridals.victorvandi.com).
- No build step — the `.html` files in the repo root are served as-is.
- Pages rebuilds automatically 1–3 min after a commit lands on `main` (check the **Actions** tab for the green ✓ on "pages build and deployment").

## I (Claude Code) cannot push directly to this repo
- `git push` is blocked by this environment's network egress policy (403 from the proxy).
- The GitHub MCP integration connected to this session is **read-only** — write calls (`push_files`, `create_or_update_file`, `delete_file`) fail with `403 Resource not accessible by integration`.
- We tried disconnecting/reconnecting the GitHub Integration connector in claude.ai → Customize → Connectors — it re-authenticated but did NOT grant write access. There is no write/delete tool-permission toggle exposed for GitHub Integration (unlike e.g. Canva, which has one). This is a dead end — don't re-attempt it each session.
- **Conclusion: don't spend time trying to fix this. Assume every session write access is read-only** and go straight to the workflow below.

## Workflow for shipping changes
1. Make edits locally in the sandbox as normal (Read/Edit tools), commit locally for tracking (won't be pushed).
2. Give the user the **complete, final file content** for each changed file — either as a code block to paste, or via `SendUserFile` as an attachment (or both).
3. Tell the user to open the file on GitHub (`main` branch) and use the **pencil ✏️ edit icon → select all → paste → "Commit directly to the `main` branch"**.
4. **Do NOT tell the user to use "Add file → Upload files" with a downloaded copy.** Browsers auto-rename repeat downloads as `booking (1).html`, `booking (2).html`, etc. Uploading that creates a NEW stray file instead of replacing the real one, and the site doesn't update. This has bitten us multiple times — always push the paste-in-place method first.
5. After committing, tell the user to check the **Actions** tab for the green build checkmark, then hard-refresh (Ctrl+Shift+R) or use Incognito to bypass browser cache.
6. Before making further edits, verify what's actually live by reading the file straight from `origin/main` (fetch + `git show origin/main:<file>`, or `mcp__github__get_file_contents` with `ref: refs/heads/main`) rather than trusting the user's description of what they uploaded — manual uploads have gone wrong silently before (uploaded stale/mislabeled versions, commit messages that don't match the actual diff, etc.).
7. Watch for stray duplicate files in repo root (e.g. `booking (1).html`) left over from failed upload attempts — flag them for deletion when found.

## Site structure quick reference
- `index.html`, `booking.html`, `collections.html` — the three pages. Each has its own desktop nav (`<nav id="nav">`), mobile nav drawer (`.mobile-nav`), and footer (`<footer>`) — text/link changes usually need to be repeated in nav + mobile nav + footer + any other page holding the same content, since there's no shared template/includes system.
- Nav bar currently (as of last change): **Services · Collections · Our Process · Book an Appointment** (Lookbook/Real Brides and FAQ links were removed from nav but kept in the footer "Explore" column).
- `booking.html` `#book` section: title ("Book an Appointment") + one consultation paragraph + two CTA buttons (WhatsApp / Email). No extra heading or divider line above the paragraph — that was intentionally removed per user request.
- Shared styles: `styles.css` (the one actually linked by all pages). There is also a `styles (2).css` in the repo that is NOT referenced by any page — leftover/unused, don't edit it thinking it's live.
- CTA copy was changed site-wide from "Book a Fitting" to "Book an Appointment", including inside URL-encoded WhatsApp/email `mailto:`/`wa.me` prefilled message text (`%20book%20an%20appointment`) — watch for this encoded form when grepping for the phrase, plain-text search alone will miss it.
