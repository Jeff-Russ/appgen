#!/usr/bin/env bash
# duco load.sh

SRC_DIR=$(cd "$(dirname ${BASH_SOURCE})" && pwd)
SRC_PATH="$SRC_DIR"/duco.js
echo "==================================="

chmod u+x "$SRC_DIR"/*.js
chmod u+x "$SRC_DIR"/*.sh
chmod u+x "$SRC_DIR"/lib/*.js
chmod u+x "$SRC_DIR"/lib/*.sh

echo "making ""$SRC_PATH"" callable directly with 'duco'"

BRC_STR="alias duco=""\"${SRC_PATH}\""
echo
echo "appending ""$HOME"/.bashrc
echo " with ""$BRC_STR"
sed -i.bak '/alias duco=/d' "$HOME"/.bashrc # so se dont have dups
echo "$BRC_STR" >> "$HOME"/.bashrc
bash
echo
echo "Done."
# echo "To view the man page, run:"
# echo
# echo "   $ bool-helpers"
echo
echo "To unload, remove the line or run ./unload.sh"
echo "==================================="