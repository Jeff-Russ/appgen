#!/bin/sh
# node-appgen configuration file


function run_appgen_install=(
  cd $TO_PATH
  pipe "Installing Node Packages";
  npm install --save express
  npm install --save grunt
  npm install --save-dev coffee-script
  npm install --save jade
  npm install --save grunt-sass
  npm install grunt-contrib-watch --save-dev
)

function run_post_install=(
  cd $TO_PATH
  line "Running npm install"
  npm install
)

