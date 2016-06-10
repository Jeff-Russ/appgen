#!/bin/sh
# node-appgen

absDirname () { echo "$(cd "$(dirname "$1")" && pwd)"; }
# source $HOME/bin/_bash/bash-boolean-helpers/bool_helpers.sh

CALLER_DIR="$(pwd)"
SRC_ROOT="$(absDirname "${BASH_SOURCE[0]}")"
DEF_FROM_DIR="$SRC_ROOT/appgen-templates/default"
CONF_SH_FILENAME="appgen-config.sh"
SYS_USER=$(id -F || id -un || whoami || git config user.name )
GIT_EMAIL=$(git config user.email || "")
author=$(git config user.name || id -F || id -un || whoami)

echo
echo '============================================================='
echo '======== appgen ============================================='

main () {

  # ___________________________________________________________
  # Check args and resources 

  if _eq $# 0; then
    checkFrom "$DEF_FROM_DIR"
    checkTo "$CALLER_DIR"
  elif _eq $# 1; then
    checkFrom "$DEF_FROM_DIR"
    checkTo "$1"
  elif _eq $# 2; then
    checkFrom "$2"
    checkTo "$1"
  else echoMagenta "Incorrect number of arguments"; abortAppgen
  fi

  # ___________________________________________________________
  # Run Installers 

  if _yea $g_conf_sh_found; then

    installPackages () {
      g_run_conf_sh=true
      source "$CONF_SH_PATH"
      run_appgen_install
    }

    m="About to run installers in:\n"
    m="${m}\n\t$cp_from_dirname/$CONF_SH_FILENAME\n\nMake a selection:"
    fp_color=34
    fancyprompt "$m" installPackages installPackages setRunConfShToFalse
  fi

  copyProject () { cp -an $FROM_DIR/. $TO_DIR/; }
 
  m="This will clone $FROM_DIR to\n"
  m="${m}$TO_DIR. No files will be overriden."
  # TODO: add cycle prompt for changing selection:
  # m="${m}Hit enter to proceed or enter a different clone source path and hit enter"
  fp_color=34
  fancyprompt "$m" copyProject copyProject cancecopy

  # Run Post Install -----------------------------------------------------

  if_yea $g_run_conf_sh && run_post_install
}


checkFrom () {

  # in here we try to find the $FROM_DIR and $CONF_SH_PATH
  # from $1 received, which could be either the user's arg or $DEF_FROM_DIR


  if _d "$1"; then
    FROM_DIR="$(cd "$1"; pwd)"
    cp_from_dirname="$(basename "$FROM_DIR")" # for display later

    if _f "$FROM_DIR/$CONF_SH_FILENAME"; then
      g_conf_sh_found=true
      g_run_conf_sh=true
      CONF_SH_PATH="$FROM_DIR/$CONF_SH_FILENAME"

    else
      g_conf_sh_found=false
      g_run_conf_sh=false
    fi
  else 
    echoRed "FATAL: missing "$1""
  fi
}

checkTo () {
  if _d "$1"; then
    if  _ls -A "$1"; then
      m="This directory is not empty! This will create a new app here."
      fancyprompt "$m" '' '' abortAppgen
    fi

    local readme=$(ls "$TO_DIR" | grep -i readme) 
    _f "$TO_DIR/package.json" && g_has_json=true
    _d "$TO_DIR/.git"         && g_has_git=true

    cd $TO_DIR

    if _yea $g_has_git
      then echoMagenta ".git found"

      local ssh=`git remote -v | grep -m1 "^origin"`
      [ -z "$ssh" ] || ssh=`git remote -v | grep -m1 ''`
      local host=$(sed 's/.*@\(.*\):.*/\1/'     <<< "$ssh") # get b/w @ and :
      author=$(sed 's/.*:\(.*\)\/.*/\1/'        <<< "$ssh") # get b/w : and /
      APP_NAME=$(sed 's/.*\/\(.*\)\.git.*/\1/'  <<< "$ssh") # get b/w / and .git
      URL="https://$host/$author/$APP_NAME"
    
    else
      APP_NAME=$(basename "$TO_DIR")
      if $(hasSpaces "$author"); then author=$(stripwhiteDowncase "$author"); fi
      URL="https://github.com/$author/$APP_NAME"
    fi

  else
    TO_DIR="$(cd "$1"; pwd)"
    mkdir "$TO_DIR"
  fi
  TO_DIR="$(cd "$1"; pwd)"
}


###############################################################################
# Special Responders

setRunConfShToFalse () { g_run_conf_sh=false; }
cancelMsg    () { echo "action canceled."; }
abortAppgen  () { echo "Goodbye"; exit 0;  }

# ____________________________________________________________________________
# STRING TEMPLATES:

declareStringTemplates () {
PACKAGE_JSON_STR_T=$(cat <<EOF
{
  "name": "$APP_NAME",
  "version": "0.0.1",
  "description": "",
  "author": "$author <$GIT_EMAIL>",
    "contributors": [{
    "name": "$SYS_USER",
    "email": "$GIT_EMAIL"
  }],
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "$URL"
  },
  "private": "true",
  "license": "MIT"
}
EOF
)

README_MD_STR_T=$(cat <<EOF
# $APP_NAME
[version 0.0.1]($URL)  
$DESC
EOF
)
}

# ___________________________________________________________
# just some utilities for executing this script:


_yea () {
  command -v "$*" >/dev/null 2>&1 || { 
    if   [ -z "$*" ];      then return 1;
    elif [ "$*" = false ]; then return 1;
    elif [ "$*" = 0 ];     then return 1;
    else return 0;
    fi
  }
  typeset cmnd="$*"
  typeset ret_code
  eval $cmnd >/dev/null 2>&1
  ret_code=$?
  return $ret_code
}

if_yea () {
  command -v "$*" >/dev/null 2>&1 || { 
    if   [ -z "$*" ];      then echo false; return 1;
    elif [ "$*" = false ]; then echo false; return 1;
    elif [ "$*" = 0 ];     then echo false; return 1;
    else echo true; return 0;
    fi
  }
  typeset cmnd="$*"
  typeset ret_code
  eval $cmnd >/dev/null 2>&1
  ret_code=$?
  test $ret_code -eq 0 && echo true || echo false
}

_f () { test -f "$@"; }
_d () { test -d "$@"; }
_ls () { test "$(ls $@)"; }
_gt () { test "$1" -gt "$2"; }
_eq () { test "$1" -eq "$2"; }

absPath () {
  # use double quotes for paths with spaces etc
  local ABS_PATH="$(cd "$1"; pwd)"
  echo "$ABS_PATH"
}
stripwhiteDowncase () {
  local var=$(printf "$1" | tr "[:upper:]" "[:lower:]")
  printf "$var" | tr -d '[[:space:]]'
}


echoBlue    () { echo "\033[34m$1\033[0m"; }
echoGreen   () { echo "\033[32m$1\033[0m"; }
echoRed     () { echo "\033[31m$1\033[0m"; }
echoMagenta () { echo "\033[35m$1\033[0m"; }

fancyprompt () {
  if [[ -z $fp_color ]]; then fp_color=33; fi
  local beg="\033[$fp_color;1m"; local end="\033[0m\n"
  printf "\033[$fp_color;5;7m\t____/ attention \____\t\t$end"
  printf "${beg}${1}${end}"
  printf "$beg - 'c'\t\tto skip or\n - [return]\tto continue$end > "
  fp_color=33
  local reply=''
  if [[ -z $TMOUT ]]; then TMOUT=10; fi
  read reply
  if [ "$#" -eq 2 ]
  then
    if   [[ "$reply" != 'c' ]]; then $2 $reply # not 'c'. default or custom 
    fi

  elif [ "$#" -eq 3 ]
  then
    if   [[ -z $reply ]];       then $2        # default (timeout or [enter])
    elif [[ "$reply" != 'c' ]]; then $3 $reply # not 'c' with custom reply
    fi

  elif [ "$#" -eq 4 ]
  then
    if   [[ -z $reply ]];       then $2        # default (timeout or [enter])
    elif [[ "$reply" != 'c' ]]; then $3 $reply # not 'c' with custom reply
    else                             $4        # reply was 'c'
    fi
  fi
}




###############################################################################
# execution starts here:

main "$@"

