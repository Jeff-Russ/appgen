#!/usr/bin/env node

var req = {}; // Place at top. See self-exec function at bottom.

req.packageJsonStempl = function(info) {
json_stempl = '\n\
{\n\
  "name": " '+info.app_name+'",\n\
  "version": "0.0.1",\n\
  "description": "",\n\
  "author": "'+info.author' <'+info.git_email'>",\n\
    "contributors": [{\n\
    "name": "'+info.sys_user'",\n\
    "email": "'+info.git_email'"\n\
  }],\n\
  "main": "app.js",\n\
  "scripts": {\n\
    "test": "echo \"Error: no test specified\" && exit 1"\n\
  },\n\
  "repository": {\n\
    "type": "git",\n\
    "url": "'+info.url'"\n\
  },\n\
  "private": "true",\n\
  "license": "MIT"\n\
}'
  return json_stempl
}

//_______________________________________________________________________

// Place at bottom. Useage: require("thisfile") or require("thisfile").globalize()
(function(ob){ob.globalize = function(){
for(var p in ob)if(ob.hasOwnProperty(p))global[p]=global[p]||ob[p];};
for(var p in ob)if(ob.hasOwnProperty(p))module.exports[p] = ob[p];})(req);
