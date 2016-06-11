#!/usr/bin/env node

require('./lib/jr_lib').globalize();
// childproc.execSync("cd "+__dirname+"; test -f package.json || npm init -f") // init if needed
require('./lib/duco_lib').globalize();

var main = function() {

  var def_from_dir = __dirname+"/templates/default-node", 
      conf_file_part = 'duco-config', old_news,
      info = { caller_dir: process.cwd() };

  var argv = getCLArgs(process.argv);

  if (argv[0] === 0) {
    info.to_dir = info.caller_dir;
    info.from_dir = def_from_dir;
  }
  else if (argv[0] === 1) {
    info.to_dir = argv[1];
    info.from_dir = def_from_dir;
  }
  else if (argv[0] === 2) {
    info.to_dir = argv[1];
    info.from_dir = argv[2];
  }
  else {
    lOut("Incorrect number of arguments");
    lOut("Goodbye");
    process.exit();
  }

  var possible_from = info.from_dir, // for error message
    if_output = " 1> /dev/null 2>&1 && echo true || echo false;",
    true_false = " && echo true || echo false;", cmds = {
    sys_user: "id -F || id -un || whoami || git config user.name || ''",
    git_email: "git config user.email || '',",
    author: "git config user.name || id -F || id -un || whoami || ''",
    to_dir_existed: 'test -d "'+info.to_dir+'"'+true_false,
    to_dir: 'mkdir -p "'+info.to_dir+'"; echo `cd '+info.to_dir+'; pwd`',
    from_dir: 'test -d "'+info.from_dir+'" && echo `cd "'+info.from_dir+'"; pwd`',
    to_dir_unempty: 'test "$(ls -A "'+info.to_dir+'")"'+true_false,
    to_dir_has_git: 'test -d "'+info.to_dir+'"/.git'+true_false,
    to_dir_has_json: 'ls "'+info.from_dir+'"/package.json '+if_output,
    to_dir_readme: 'ls "'+info.to_dir+'" | grep -i readme',
    from_dir_exists: 'test -d "'+info.from_dir+'"'+true_false,
    from_dir_config: 'ls "'+info.from_dir+'" | grep "'+conf_file_part+'"'
  };
  spelunker(cmds, info);

  if (info.from_dir_exists === false) {
    lOut(fg.yel+bg.red+"  ERROR: "+possible_from+" directory was not found. Aborting.");
    process.exit();
  }

  if (info.to_dir_unempty === true) {
    lOut(fg.red+bg.yel+"  WARNING: "+info.to_dir+" is not empty. Are you sure?");
    lOut(fg.yel+bg.blk+"Nothing will be overwritten but content will be added.");
    abortIfEqual(prompt(["y","N"], "n" ), "n" );
  } 

  mvProps(info,["from_dir_exists","to_dir_unempty","to_dir_existed"],old_news);
  mineForGitInfo(info);
  makeReadme(info);
  mvProps(info,["to_dir_has_git","to_dir_readme"],old_news);

  // var run_config_result;
  // var clone_result = safelyCloneDir(info.from_dir, info.to_dir);
  // if (/\S/.test(info.from_dir_config)) {
  //   if (hasSubstr(info.from_dir_config, "node")) {
  //     safelySetFileContent('"' + info.to_dir + '"/package.json', packageJsonStempl());
  //   }
  //   var run_config_result = shSnc(info.from_dir_config);
  // }
}

main();
