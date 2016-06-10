#!/usr/bin/env bash
# appgen load.sh

SRC_DIR=$(cd "$(dirname ${BASH_SOURCE})" && pwd)
SRC_PATH="$SRC_DIR"/appgen.js
echo "==================================="

chmod u+x "$SRC_DIR"/*.js
chmod u+x "$SRC_DIR"/*.sh
chmod u+x "$SRC_DIR"/lib/*.js
chmod u+x "$SRC_DIR"/lib/*.sh

echo "making ""$SRC_PATH"" callable directly with 'appgen'"

BRC_STR="alias appgen=""\"${SRC_PATH}\""
echo
echo "appending ""$HOME"/.bashrc
echo " with ""$BRC_STR"
sed -i.bak '/alias appgen=/d' "$HOME"/.bashrc # so se dont have dups
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