#!/usr/bin/env bash
# duco unload.sh

SRC_DIR=$(cd "$(dirname ${BASH_SOURCE})" && pwd)
SRC_PATH="$SRC_DIR"/duco.js
echo "==================================="

echo "making ""$SRC_PATH"" only callable directly"

BRC_STR="alias duco=""\"${SRC_PATH}\""
echo
echo "removing ""$BRC_STR"
echo " from ""$HOME"/.bashrc
echo "a backup of ~/.bashrc will be made: ~/.bashrc.bak"
sed -i.bak '/alias duco=/d' "$HOME"/.bashrc
bash
echo
echo "Done."
echo
echo "To reload, run ./load.sh again"
echo "==================================="