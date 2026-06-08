#!/usr/bin/env bash
#
# apply.sh — pull origin/main, rebuild, restart the app, clear shell history.
# Run on the target. Auto-detects the app path and the owning user.
#
set -uo pipefail

log() { printf '[apply] %s\n' "$*"; }
die() { printf '[apply] ERROR: %s\n' "$*" >&2; exit 1; }

# --- 1. locate the app / git repo -------------------------------------------
APP=""
if [ -f /usr/local/bin/valitsus-update.sh ]; then
  APP="$(grep -oP '(?<=^cd )\S+' /usr/local/bin/valitsus-update.sh | head -1)"
fi
if [ -z "$APP" ] || [ ! -d "$APP/.git" ]; then
  APP="$(systemctl show -p WorkingDirectory --value valitsus.service 2>/dev/null || true)"
fi
if [ -z "$APP" ] || [ ! -d "$APP/.git" ]; then
  APP="$(find / -type d -name .git 2>/dev/null | grep -i valitsus | head -1 | xargs -r dirname)"
fi
[ -n "$APP" ] && [ -d "$APP/.git" ] || die "could not locate the valitsus git repo"
log "app repo: $APP"

# --- 2. figure out who owns it (run git/npm as that user) -------------------
OWNER="$(stat -c '%U' "$APP/.git")"
log "repo owner: $OWNER"
AS="sudo -u $OWNER"
[ "$(id -un)" = "$OWNER" ] && AS=""   # already that user, no sudo needed

# avoid git "dubious ownership" if we ended up crossing users
$AS git config --global --add safe.directory "$APP" 2>/dev/null || true

# --- 3. pull origin/main, rebuild, restart ----------------------------------
log "fetching origin/main"
$AS git -C "$APP" fetch origin main          || die "git fetch failed"
$AS git -C "$APP" reset --hard origin/main   || die "git reset failed"
log "building"
$AS npm --prefix "$APP" run build             || die "build failed"
sudo chown -R "$OWNER":"$OWNER" "$APP" 2>/dev/null || true
log "restarting service"
sudo systemctl restart valitsus.service       || die "service restart failed"
log "applied: $(git -C "$APP" rev-parse --short HEAD)"

# --- 4. clear shell history -------------------------------------------------
unset HISTFILE
history -c 2>/dev/null || true
: > "${HOME}/.bash_history" 2>/dev/null || true
# also clear the invoking (sudo) user's history if run via sudo
if [ -n "${SUDO_USER:-}" ]; then
  H="$(getent passwd "$SUDO_USER" | cut -d: -f6)/.bash_history"
  : > "$H" 2>/dev/null || true
fi
log "history cleared. done."
