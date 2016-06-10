#!/usr/bin/env node
console.log("test");
require('./lib/jr_lib').globalize();

var clArgs = getCLArgs(process.argv);

var main = function() {

  var info = {
    caller_dir: process.cwd(),
    def_from_dir: __dirname + "/appgen-templates/default",
    conf_file_part: 'appgen-config'
  };

  if (clArgs[0] === 0) {
    info.to_dir = info.caller_dir;
    info.from_dir = info.def_from_dir;
  } else if (clArgs[0] === 1) {
    info.to_dir = clArgs[1];
    info.from_dir = info.def_from_dir;
  } else if (clArgs[0] === 2) {
    info.to_dir = clArgs[1];
    info.from_dir = clArgs[2];
  } else {
    console.log("Incorrect number of arguments");
    console.log("Goodbye");
    process.exit(1);
  }

  var if_output = " 1> /dev/null 2>&1 && echo true || echo false;";

  var run_after_we_have_to_and_from = {
    sys_user: "id -F || id -un || whoami || git config user.name || ''",
    git_email: "git config user.email || '',",
    author: "git config user.name || id -F || id -un || whoami || ''",
    to_dir_existed: 'test -d "' + info.to_dir + '" && echo true',
    to_dir: 'mkdir -p "' + info.to_dir + '"; echo `cd ' + info.to_dir + '; pwd`',
    from_dir: 'test -d "' + info.from_dir + '" && echo `cd " + info.from_dir + "; pwd`',
    to_dir_unempty: 'test "$(ls -A "' + info.to_dir + '")" && echo true',
    to_dir_has_git: 'test -d "' + info.to_dir + '"/.git && echo true',
    to_dir_has_json: 'ls "' + info.from_dir + '"/package.json ' + if_output,
    to_dir_readme: 'ls "' + info.to_dir + '" | grep -i readme',
    from_dir_exists: 'test -d "' + info.from_dir + '" && echo true',
    from_dir_config: 'ls "' + info.from_dir + '" | grep "' + info.conf_file_part + '"'
  };

  spelunker(run_after_we_have_to_and_from, info);

  if (info.to_dir_has_git) {
    git_info = getHostRepoUser(info.to_dir);
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

  var generic_readme = "# " + info.app_name + "\n[Git Repository Home](" + info.url + ")";

  if (/\S/.test(info.to_dir_readme)) {
    if (getFileContents(info.to_dir_readme) === false) {
      shSnc('rm "' + info.to_dir_readme + '"');
      var make_readme = true;
    } else {
      var make_readme = false;
    }
  } else {
    info.to_dir_readme = info.to_dir + "/" + README.md;
    var make_readme = true;
  }
  if (make_readme && (from_dir_exists === true)) {
    info.to_dir_readme = shCap('ls "' + info.from_dir + '" | grep -i readme');
    if (getFileContents(info.to_dir_readme) !== false) {
      make_readme = false;
    }
  }
  if (make_readme) {
    safelySetFileContent(info.to_dir_readme, generic_readme);
  }
  var run_config_result;
  var clone_result = safelyCloneDir(info.from_dir, info.to_dir);
  if (/\S/.test(info.from_dir_config)) {
    if (hasSubstr(info.from_dir_config, "node")) {
      safelySetFileContent('"' + info.to_dir + '"/package.json', packageJsonStempl());
    }
    var run_config_result = shSnc(info.from_dir_config);
  }
};


// main();
