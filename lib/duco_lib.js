#!/usr/bin/env node

var req = {}; // Place at top. See self-exec function at bottom.

req.mineForGitInfo = function(info) {
  if (info.to_dir_has_git) {
    var git_info = getHostRepoUser(info.to_dir);
    if (git_info !== false) {
      info.app_name = git_info[1];
      info.author = git_info[2];
      info.url = "https://" + git_info[0] + "/" + info.author + "/" + info.app_name;
    }
  } else {
    info.app_name = info.to_dir.substring(1 + info.to_dir.lastIndexOf('/'));
    if (info.author.indexOf(' ') >= 0) {
      info.author = rmWhite(info.author).toLowerCase();
    }
    info.url = "https://github.com/" + info.author + "/" + info.app_name;
  }
};

req.makeReadme = function(info) {
  var generic_readme = "# "+info.app_name+"\n[Git Repository Home]("+info.url+")";
  if (/\S/.test(info.to_dir_readme)) {
    if (getFileContents(info.to_dir_readme) === false) {
      shSnc('rm "' + info.to_dir_readme + '"');
      var make_readme = true;
    } else { var make_readme = false;}
  } else {
    info.to_dir_readme = info.to_dir + "/" + README.md;
    var make_readme = true;
  }
  if (make_readme && (from_dir_exists === true)) {
    info.to_dir_readme = shCap('ls "' + info.from_dir + '" | grep -i readme');
    if (getFileContents(info.to_dir_readme) !== false) { make_readme = false; }
  }
  if (make_readme) { safelySetFileContent(info.to_dir_readme, generic_readme); }
};

req.packageJsonStempl = function(info) {
json_stempl = '\n\
{\n\
  "name": " '+info.app_name+'",\n\
  "version": "0.0.1",\n\
  "description": "",\n\
  "author": "'+info.author+' <'+info.git_email+'>",\n\
    "contributors": [{\n\
    "name": "'+info.sys_user+'",\n\
    "email": "'+info.git_email+'"\n\
  }],\n\
  "main": "app.js",\n\
  "scripts": {\n\
    "test": "echo \"Error: no test specified\" && exit 1"\n\
  },\n\
  "repository": {\n\
    "type": "git",\n\
    "url": "'+info.url+'"\n\
  },\n\
  "private": "true",\n\
  "license": "MIT"\n\
}'
  return json_stempl
};

//_______________________________________________________________________

// Place at bottom. Useage: require("thisfile") or require("thisfile").globalize()
(function(ob){ob.globalize = function(){
for(var p in ob)if(ob.hasOwnProperty(p))global[p]=global[p]||ob[p];};
for(var p in ob)if(ob.hasOwnProperty(p))module.exports[p] = ob[p];})(req);
