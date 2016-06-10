#!/bin/sh

# ____________________________________________________________________________
# STRING TEMPLATES:

# ___________________________________________________________

evalBool () {
   eval "
   if $1
   then
      echo true
      exit 0
   else
      echo false
      exit 1
   fi"
}

bool () {
   # falsy:
   if   [ -z "$1" ];      then exit 1
   elif [ "$1" = false ]; then exit 1
   elif [ "$1" = 0 ];     then exit 1

   else exit 0; # truthy
   fi
}

not () {
   # truthy:
   if   [ -z "$1" ];      then exit 0
   elif [ "$1" = false ]; then exit 0
   elif [ "$1" = 0 ];     then exit 0

   else exit 1; # falsy
   fi
}

all () {
   while test ${#} -gt 0; do
      if   [ -z "$1" ];      then exit 1
      elif [ "$1" = false ]; then exit 1
      elif [ "$1" = 0 ];     then exit 1

      else shift
      fi
   done
}

none () {
   while test ${#} -gt 0 ; do
      if   [ -z "$1" ];      then shift
      elif [ "$1" = false ]; then shift
      elif [ "$1" = 0 ];     then shift

      else exit 1
      fi
   done
}

# ___________________________________________________________
# just some utilities for executing this script:

echoBlue    () { echo "\033[34m$1\033[0m"; }
echoGreen   () { echo "\033[32m$1\033[0m"; }
echoRed     () { echo "\033[31m$1\033[0m"; }
echoMagenta () { echo "\033[35m$1\033[0m"; }

bar () {
  echo
  echo '###############################################################'
  echo "######## $1"
}
pipe () {
  echo
  echo '============================================================='
  echo "======== $1"
}
line () {
  echo
  echo '___________________________________________________________'
  echo "________ $1"
}


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
replaceChars () {
  echo $1 | tr $2 ${3:-''}
}
fancyfail () {
  if [[ -z $fail_color ]]; then fail_color=31; fi
  local beg="\033[$fail_color;3m"; local end="\033[0m\n"
  printf "\033[$fail_color;1;7m\t____/ attention \____\t\t$end"
  printf "${beg}${1}${end}"
}
absPath () {
  # use double quotes for paths with spaces etc
  local ABS_PATH=`cd "$1"; pwd` 
  echo "$ABS_PATH"
}
stripwhiteDowncase () {
  local var=$(printf "$1" | tr "[:upper:]" "[:lower:]")
  printf "$var" | tr -d '[[:space:]]'
}

hasSpaces () {
  if [[ "$1" != "${1/ /}" ]]
  then echo true
  else  echo false
  fi
}
isInt () {
  if [[ $1 =~ ^-?[0-9]+$ ]]
  then echo true
  else  echo false
  fi 
}