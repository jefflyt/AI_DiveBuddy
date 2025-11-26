#!/usr/bin/env bash
# Simple helper to run the DiveBuddy app from the repo root (macOS / zsh-compatible)
# Usage: ./run.sh dev [port]    # start dev server (detached, logs -> /tmp/divebuddy_dev.log)
#        ./run.sh build         # run production build
#        ./run.sh start [port]  # run production start (foreground)
#        ./run.sh stop          # stop detached dev server started by this script
#        ./run.sh open [port]   # open http://localhost:PORT in default browser
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/divebuddy-app"
PID_FILE="/tmp/divebuddy_dev.pid"
LOG_FILE="/tmp/divebuddy_dev.log"
PORT="${2:-${PORT:-3001}}"

usage() {
  cat <<EOF
Usage: $0 {dev|build|start|stop|open|help} [port]
  dev   : start Next dev server detached (writes PID to $PID_FILE, logs to $LOG_FILE)
  build : build the Next app (runs npm run build in $APP_DIR)
  start : run production start (foreground; requires prior build)
  stop  : stop detached dev server (reads PID from $PID_FILE)
  open  : open http://localhost:PORT in default browser
EOF
  exit 1
}

if [ $# -lt 1 ]; then
  usage
fi

cmd="$1"

case "$cmd" in
  dev)
    PORT="${2:-$PORT}"
    echo "Starting dev server in $APP_DIR on port $PORT"
    nohup npm --prefix "$APP_DIR" run dev -- -p "$PORT" >"$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "Started (PID $(cat "$PID_FILE")), logs -> $LOG_FILE"
    ;;
  build)
    echo "Building app in $APP_DIR"
    npm --prefix "$APP_DIR" run build
    ;;
  start)
    PORT="${2:-$PORT}"
    echo "Starting production server in $APP_DIR on port $PORT"
    npm --prefix "$APP_DIR" run start -- -p "$PORT"
    ;;
  stop)
    if [ -f "$PID_FILE" ]; then
      PID="$(cat "$PID_FILE")"
      echo "Stopping PID $PID"
      kill "$PID" || echo "Process $PID not running"
      rm -f "$PID_FILE"
      echo "Stopped"
    else
      echo "No PID file at $PID_FILE"
      exit 1
    fi
    ;;
  open)
    PORT="${2:-$PORT}"
    open "http://localhost:$PORT"
    ;;
  help|-h|--help)
    usage
    ;;
  *)
    usage
    ;;
esac
