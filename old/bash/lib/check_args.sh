#!/bin/sh

check_args () {

  if [ "$#" -eq 0 ]
  then
    DIR_MISSING=false
    DESC=''

    if [ "$(ls -A $CALLER_PATH)" ]
    then
      m="This directory is not empty! This will create a new app here."
      fancyprompt "$m" '' '' abort_appgen
    fi

    PROJ_PATH=$(abs_path "$CALLER_PATH")

  elif [ "$#" -eq 2 ]
  then
    mkdir "$1"
    PROJ_PATH=$(abs_path "${CALLER_PATH}/${1}")

    if [ -d "$2" ]
    then 
      COPY_SRC=$(abs_path "$2")
      DIR_MISSING=false

      if [ -f "$2/node-appgen-installs" ]
      then 
        INST_MISSING=false
        INSTALLER="$COPY_SRC/node-appgen-config.sh"

      else
        INSTALLER="$2/node-appgen-config" # for fail display
        INST_MISSING=true
        RUN_NPM=false
      fi

    else
      COPY_SRC="$2" # for fail display
      DIR_MISSING=true
    fi

  else # TODO: add help menu
    echo_magenta "Incorrect number of arguments" 
  fi
}
