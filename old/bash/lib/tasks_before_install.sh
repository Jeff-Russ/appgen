#!/bin/sh

tasks_before_install () {

  SRC_DIR_NAME=$(basename "$COPY_SRC")
  echo "gathering project variables..."
  local HAS_JSON=false; local HAS_GIT=false 

  if [ -d "$PROJ_PATH" ]
  then # inspect any pre-existing content
    echo_blue "found directory with matching name"

    # store name of readme if found: 
    local README=$(ls "$PROJ_PATH" | grep -i readme) 

    if [ -f "$PROJ_PATH/package.json" ]; then HAS_JSON=true; fi
    if [ -d "$PROJ_PATH/.git" ];         then HAS_GIT=true;  fi
  
  else
    mkdir $PROJ_PATH
  fi

  cd $PROJ_PATH

  if $HAS_GIT; then 
    echo_magenta ".git found"

    local SSH=`git remote -v | grep -m1 "^origin"`
    [ -z "$SSH" ] || SSH=`git remote -v | grep -m1 ''`
    local HOST=$(sed 's/.*@\(.*\):.*/\1/' <<< "$SSH") # get b/w @ and :
    AUTHOR=$(sed 's/.*:\(.*\)\/.*/\1/'    <<< "$SSH") # get b/w : and /
    PROJ=$(sed 's/.*\/\(.*\)\.git.*/\1/'  <<< "$SSH") # get b/w / and .git
    URL="https://$HOST/$AUTHOR/$PROJ"
  
  else
    PROJ=$(basename "$PROJ_PATH")
    if $(has_spaces "$AUTHOR"); then AUTHOR=$(stripwhite_downcase "$AUTHOR"); fi
    URL="https://github.com/$AUTHOR/$PROJ"
  fi
  # _______________________________________________________
  # package.json

  declare_string_templates

  if $HAS_JSON
  then echo_magenta "package.json found. Skipping..."
  else
    printf "\nCreating package.json file with the following info:\n\n"
    printf "You:     $NAME\nProject: $PROJ $URL\nAuthor:  $AUTHOR $EMAIL\n\n"
    echo "More info will be added when packages are installed"
    printf "$PACKAGE_JSON" > $PROJ_PATH/package.json
  fi
  # ______________________________________________________________________
  # README.md -silence warning while installing packages by making non-empty
  if [ -z "$README" ]; then
    echo
    echo "Creating README.md"
    printf "$README_MD" > $PROJ_PATH/README.md
  else
    if [ -s "$PROJ_PATH/$README" ]; then  : # file has content so do nothing
    else echo "# " >> $PROJ_PATH/$README    # need something to avoid npm warnings
    fi
  fi
}

###############################################################################
# Special Responders

npm_install_cancel () { RUN_NPM=false; }
cancel_msg    () { echo "action canceled."; }
abort_appgen  () { echo "Goodbye"; exit 0;  }