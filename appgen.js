#!/usr/bin/env node

require('./lib/jr_lib').globalize();
require('./lib/appgen_lib').globalize();

var main = function() {

  var info = {
    caller_dir: process.cwd(),
    def_from_dir: __dirname + "/templates/default-node",
    conf_file_part: 'appgen-config'
  };

  var clArgs = getCLArgs(process.argv);

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
    lOut("Incorrect number of arguments");
    lOut("Goodbye");
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

  // mineForGitInfo(info);
  
  // makeReadme(info);
}

main();
