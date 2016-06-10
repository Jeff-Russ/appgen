#!/bin/sh

# ____________________________________________________________________________
# STRING TEMPLATES:

declare_string_templates () {
PACKAGE_JSON=$(cat <<EOF
{
  "name": "$PROJ",
  "version": "0.0.1",
  "description": "$DESC",
  "author": "$AUTHOR <$EMAIL>",
    "contributors": [{
    "name": "$NAME",
    "email": "$EMAIL"
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

README_MD=$(cat <<EOF
# $PROJ
[version 0.0.1]($URL)  
$DESC
EOF
)
}
