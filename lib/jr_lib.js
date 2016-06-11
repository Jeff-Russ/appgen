#!/usr/bin/env node
/*
================================================================================
 jr_lib.js  :   general purpose toolbox of functions for Node.js
 Created: 3 June 2016 11:46:40am
 Author:  Jeff-Russ     https://github.com/Jeff-Russ
================================================================================
*/

 //__________________ used by this file & not exported ______________________\\
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\

const execSync = require('child_process').execSync;

//#############################################################################

var req = {}; // Place at top. See self-exec function at bottom.

// NOTE that functions with names starting with `.this_` are not meant to work
// without being methods by assigning them to objects. Some take functions as
// arguments and have the `this` keyword available within the functions you 
// define. You should drop the `.this_` when assigned. See below for example.

// base funcs others depend on !!
req.eachProp = function(ob,fn) {
  for (var prop in ob)
    if (ob.hasOwnProperty(prop)) { fn(prop); }
};
req.forEach = function(ob,fn,opt) {
  for (var prop in ob)
    if (ob.hasOwnProperty(prop))
      fn(ob,prop,opt);
};
req.this_forEach = function(fn, opt) {
  for (var prop in this)
    if (this.hasOwnProperty(prop) && prop !== "forEach")
      fn.call(this, prop, opt);
}; // this would be used like this (provided it's added to global and not req, etc...):
// obj = {prop1:"value1",prop2:"value2"}; // example obj
// obj.forEach = this_forEach; // add to obj (no req. because it's global now)
// // using it:                   (opt was optional)
// obj.forEach(function(prop) { // don't see `this` 
//   console.log(this[prop]);   // but it's available
// });

req.setIfUndef = function(token, default_val) {
  if (token === undefined) { return default_val; }
  else { return token; }
};


// req.setIfUndecl = function(token, default_val) {
//   try { token.dummy; }
//   catch(e) { var token = default_val}
//   return token;
// };

/* Returns true if object (arg1) has property (arg2 as string) declared.
Works on principal that obj.noddefined won't throw error
but obj.noddefined.dummy will. */
// req.hasPropname = function(obj, propname) {
//   var ret = true;
//   try { fromOb[propname].dummy; }
//   catch(e) { ret = false }
//   return ret;
// };


/* Returns true if whatever passed is declared. 
Call with isDeclared(token), isDeclared(obj.prop), 
isDeclared(obj["propname"]),  isDeclared(obj.prop.prop), etc.
Works on principal that obj.noddefined won't throw error
but obj.noddefined.dummy will. */
// req.isDecl = function(identifier) {
//   var ret = true;
//   try { identifier.dummy; }
//   catch(e) { ret = false }
//   return ret;
// };

// req.notDecl = function(identifier) {
//   var ret = false;
//   try { identifier.dummy; }
//   catch(e) { ret = true }
//   return ret;
// };

 //________________________ data objects __________________________________\\
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\

req.mvAllProps = function(from_obj, to_obj, force) {
  if (force === "force") { 
    eachProp(from_obj, function(prop){
      to_obj[prop] = from_obj[prop]; delete from_obj[prop];
    });
  } else {
    eachProp(from_obj, function(prop){
      if (to_obj[prop] === undefined) {
        to_obj[prop] = from_obj[prop]; delete from_obj[prop];
      }
    });
  }
};
req.cpAllProps = function(from_obj, to_obj, force) {
  if (force === "force") { 
    eachProp(from_obj, function(prop) { to_obj[prop] = from_obj[prop];});
  } else {
    eachProp(from_obj, function(prop){
      if (to_obj[prop] === undefined) { to_obj[prop] = from_obj[prop]; }
    });
  }
};
req.rmAllProps = function(obj) {
  eachProp(obj, function(prop){ delete obj[prop]; });
};

req.mv = function(source, destination) { destination = source; delete source; };

req.mvProp = function(from_obj, from_propname,  to_obj, to_propname) {
  var to_propname = setIfUndef(to_propname, from_propname);
  to_obj[to_propname] = from_obj[from_propname]; delete from_obj[from_propname];
};

req.mvProps = function(from_obj, propnames, to_obj) {
  for (var i = 0; i < propnames.length; i++ ) {
    to_obj[propnames[i]] = from_obj[propnames[i]]; delete from_obj[propnames[i]];
  }
};

 //__________________ Command Line Input and Output _________________________\\
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\

// because I hate typing them out
req.cLog = console.log; 
req.cError = console.error; 

req.readLn = function () {
  // const execSync = require('child_process').execSync;
  return execSync('read reply </dev/tty; echo "$reply"',{stdio:'pipe'})
                  .toString().replace(/\n$/, '');
};

req.prompt = function(array, dfault) {

  if (dfault === undefined) {
    var ret = "";
    var repeat = true;
  } else { 
    var ret = dfault;
    var dfault = dfault.toLowerCase();
    repeat = false;
  }

  if (array === undefined) {
    array = ["y", "n"];
    var msg = "   | y | n |  Enter your reply:  ";
  } else {
    var msg = "   |";
    var array = array.map(function(e) {
      msg = msg+" "+e+" |";
      return e.toLowerCase();
    });
    msg = msg+"  Enter your reply:  ";
  }

  var go = true, no_op = 0; 
  // const execSync = require('child_process').execSync;
  process.stdout.write(msg);

  while(go) {
    var reply = execSync('read reply </dev/tty; echo "$reply"',{stdio:'pipe'})
                  .toString().replace(/\n$/, '').toLowerCase();
    for (var i = 0; i < array.length; i++) {
      if (array[i] === reply) {
        ret = reply;
        repeat = false;
        break;
      }
    }
    go = repeat;
    go ? process.stdout.write("invalid reply, try again "+msg) : no_op;
  }
  return ret;
}

req.lRaw = function(s){ return process.stdout.write(JSON.stringify(s+"\n"));};
req.pRaw = function(s){ return process.stdout.write(JSON.stringify(s));};
req.pProps = function(ob){ forEach(ob,function(prop){console.log(prop);});};
req.pIns = function(ob,raw) {
  var pr;
  raw ? pr = req.lRaw : pr = req.lOut;
  forEach(ob,function(p){
    pr(ob[p].constructor.name+" "+p+": "+ob[p]);
  });
};
req.pObj = function(ob,raw) {
  var pr;
  raw ? pr = req.lRaw : pr = req.lOut;
  req.forEach(ob,function(p){
    pr(ob[p]);
  });
};
req.pMethods = function(obj) {
  for(var prop in obj) {
    if(typeof obj[prop] === "function") { console.log(prop)}
  }
}
req.pNonMethods = function(obj) {
  for(var prop in obj) {
    if(typeof obj[prop] !== "function") { console.log(prop)}
  }
};

 //_________ string constants for formatting console output _________________\\
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\
req.tf = { n: "\n", nn: "\n\n", t: "\t", tt: "\t\t", nt: "\n\t", s4: "    ",
      bright:"\x1b[1m", dim:"\x1b[2m", uline:"\x1b[4m",
      blink:"\x1b[5m",  inv:"\x1b[7m", hide: "\x1b[8m",rst:"\x1b[0m"};
req.fg = { blk: "\x1b[30m", red: "\x1b[31m", grn: "\x1b[32m", yel: "\x1b[33m",
      blu: "\x1b[34m", mag: "\x1b[35m", cyn: "\x1b[36m", whi: "\x1b[37m"};
req.bg = { blk: "\x1b[40m", red: "\x1b[41m", grn: "\x1b[42m", yel: "\x1b[43m",
      blu: "\x1b[44m", mag: "\x1b[45m", cyn: "\x1b[46m", whi: "\x1b[47m"};

 //_______ functions for faster printing with auto-cancel of escape codes ____________\\
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\

req.lOut = function(s,e){e ? e = "" : e = "\x1b[0m";return process.stdout.write(s+e+"\n");};
req.pOut = function(s,e){e ? e = "" : e = "\x1b[0m";return process.stdout.write(s+e); };
req.lErr = function(s,e){e ? e = "" : e = "\x1b[0m";return process.stderr.write(s+e+"\n");};
req.pErr = function(s,e){e ? e = "" : e = "\x1b[0m";return process.stderr.write(s+e);};

 //____________________ general string funcs _________________________________________\\
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\

req.abortIfEqual = function(var1, var2) { if (var1 === var2) { process.exit(); } };

req.rmNewlObj = function(ob) {
  forEach(ob,function(prop){
    ob[prop]=obj[prop].replace(/(\r\n|\n|\r)/gm,"");
  });
};
req.rawStr    = function(str){ return JSON.stringify(str); };
req.rmWhite   = function(str){ return str.replace(/\s+/g, ''); };
req.hasSpaces = function(str){ return str.indexOf(' ') > -1; };
req.hasNonWhite = function(str){ /\S/.test(str); };
req.hasSubstr = function(str, sub) { return string.indexOf(sub) > -1; };

// returns an array of any unspecified arguments a function might get 
req.getSplats = function(func,args){return Array.prototype.slice.call(args,func.length);}
// useage:
/*function func(arg){var splats=getSplats(func, arguments);console.log(arg+splats);}
func("onlyfirst ", "secretsecond ", "topsecret");*/

 //________________________________ type _____________________________________________\\
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\

req.ptypeName = function(ob) {    // pass arr_ob, it returns: "[object Array]" 
  return Object.prototype.toString.call(ob); 
};

req.stringToType = function(string) {
  if (isNaN(string)) {
    if      (string === "true")  { return true;  }
    else if (string === "false") { return false; }
    else                         { return string; }
  }
  else { return Number(string); }
};

 //________________________ Node-specific ____________________________________________\\
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\

req.preReq = function(pkg, cmd){
  try { require.resolve(pkg);  // MUST BE CALLED WHERE IT'S NEDDED!!
  } catch(e) {
    console.error("require('"+pkg+"'); failed. running "+cmd+"...");
    // const execSync = require('child_process').execSync;
    execSync('cd '+__dirname+'; '+cmd);
  }
};
req.safeReq = function(pkg, cmd) {
  try { require.resolve(pkg);  // MUST BE CALLED WHERE IT'S NEDDED!!
  } catch (e) {
    console.error("require('" + pkg + "'); failed. running " + cmd + "..");
    // const execSync = require('child_process').execSync;
    execSync("cd " + __dirname + "; " + cmd);
  }
  require(pkg);
};

//________________________ shell stuff _______________________________________________\\
//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\\

req.getCLArgs = function (process_argv){
  var process_argv = process_argv || process.argv;
  clArgs = [process_argv.length - 2];
  for (var i = 2; i < process_argv.length; i++) {
    clArgs[i-1] = process_argv[i];
  }
  return clArgs
};

req.shSnc = require('child_process').execSync;
req.childproc = require('child_process');

req.shCap = function(cmd) {
  // const execSync = require('child_process').execSync;
  return execSync(cmd,{stdio:'pipe'}).toString().replace(/\n$/, '');
};

//_______________________________________________________________________
req.spelunker = function(cmdsOb, resultsOb) {

  var cmds_str, resultsOb = resultsOb || {}

  // add iterator method to cmdsOb
  cmdsOb.iter = function(fn) {
    for(var p in this) { if(this.hasOwnProperty(p) && p !== "iter") { fn(p); } }
  };
  // build cmds_str with contents of cmdObj using cmdObj.iter()
  cmdsOb.iter(function(prop) {
    cmds_str += prop+"=resultsOb."+prop+"\" = \"\"'$("+cmdsOb[prop]+")';\";\n";
  });
  cmds_str += 'echo '; // now we start the second part, echoing all back
  
  // second run of cmdObj.iter(), appending echo info:
  cmdsOb.iter(function(prop) { cmds_str += "\"$"+prop+"\\n\"";} ); // console.log(cmds_str)

  // run all commands, getting output:
  // const execSync = require('child_process').execSync;
  var output = execSync(cmds_str, {stdio:'pipe'})
                                       .toString().replace(/\n$/, '');

  // this uses echoed output to populate temp resultsOb
  eval(output); //console.log(resultsOb)

  // re-interpret types:
  cmdsOb.iter(function(prop) {
    // if isn't number string see if it's a boolean string. Make actual boolean
    // if (isNaN(resultsOb[prop])) {
      if     (resultsOb[prop] === "true") { resultsOb[prop] = true;  }
      else if(resultsOb[prop] === "false"){ resultsOb[prop] = false; }
    // }
    // // if a number string, make an actual number
    // else { resultsOb[prop] =  Number(resultsOb[prop]); }
  }); 

  return resultsOb; 
};

/*_______________________________________________________________________

Writes `content` to `filepath` if file is empty or only contains whitespace.
If file doen't exist it'll be created. Note: file is written not appended.
returns "nonempty" if it finds content and doesn't complete operation.
otherwise you'll probably get a blank string returned. */
req.safelySetFileContent = function(filepath, content) {
  var cmds = 'txt=$(cat "' + filepath + '");';
  cmds = cmds + '[[ "$txt" = *[![:space:]]* ]] || txt=onlywhite;';
  cmds = cmds + 'if test $txt = onlywhite;' + 'then printf "' + content;
  cmds = cmds + '" > "' + filepath + '"; else echo nonempty; fi;';
  // const execSync = require('child_process').execSync;
  return execSync( cmds, {stdio:'pipe'}).toString().replace(/\n$/, '');
};

/*_______________________________________________________________________

Returns contents of `filepath` as string if contents are found.
If file is empty or only contains whitespace or does not exist,
false is returned. */
req.getFileContents = function(filepath) {
  var cmds = 'txt=$(cat "' + filepath + '");';
  cmds = cmds + '[[ "$txt" = *[![:space:]]* ]] || txt=onlywhite;';
  cmds = cmds + 'if test $txt = onlywhite;' + 'then echo false;';
  cmds = cmds + 'else cat "' + filepath + '"; fi;';
  // const execSync = require('child_process').execSync;
  return execSync( cmds, {stdio:'pipe'}).toString().replace(/\n$/, '');
};

/*_______________________________________________________________________

Takes all files a folders (recursively) in from_dir and makes duplicates
in to_dir, unless they already exist.
*/
req.safelyCloneDir = function(from_dir, to_dir) {
  var cmd_str = 'cp -an "' + from_dir + '"/. "' + to_dir + '"/;';
  // const execSync = require('child_process').execSync;
  return execSync(cmd_str, {stdio: 'pipe'}).toString().replace(/\n$/, '');
};

//_______________________________________________________________________
req.getHostRepoUser = function(directory) {
  
  // command to be run in shell that shows first remote of git repo
  var cmd_str = "cd " + directory + "; echo $(git remote -v | grep -m1 '')";

  // run command and get output
  // const execSync = require('child_process').execSync;
  var str = execSync(cmd_str, {stdio: 'pipe'}).toString().replace(/\n$/, '');
  // should be able to work with both of these as str:
  // str = "origin   https://github.com/Jeff-Russ/mdd (fetch)"
  // str = "origin git@github.com:Jeff-Russ/mdd.git (fetch)"

  var ob = {}; // to hold results
  ob.at = str.indexOf('@'); // a sign of ssh
  ob.ss = str.search('//');
  ob.repo_start = 1 + str.lastIndexOf('/');

  if (ob.ss > ob.at) { // we don't have ssh
    ob.host = str.substring(ob.ss + 2);
    ob.host = ob.host.substring(0, ob.host.indexOf('/'));
    ob.repo = str.substring(ob.repo_start, str.lastIndexOf(' '));
  }
  else {
    ob.host = str.substring(1 + ob.at, str.indexOf(':')); // get host
    ob.repo = str.substring(ob.repo_start, str.lastIndexOf('.'));
  }
  // user is just before repo, either 
  // after last : or / whichever is later
  ob.chop_end = str.substring(0, ob.repo_start - 1);
  ob.colon = ob.chop_end.lastIndexOf(':');
  ob.slash = ob.chop_end.lastIndexOf('/');
  ob.user_after = Math.max(ob.colon, ob.slash);
  ob.user = ob.chop_end.substring(ob.user_after + 1);

  if (ob.host && ob.repo && ob.user) {
    return [ob.host, ob.repo, ob.user];
  } else {
    return false;
  }
};

//_______________________________________________________________________

// Place at bottom. Useage: require("thisfile") or require("thisfile").globalize()
(function(ob){ob.globalize = function(){
for(var p in ob)if(ob.hasOwnProperty(p))global[p]=global[p]||ob[p];};
for(var p in ob)if(ob.hasOwnProperty(p))module.exports[p] = ob[p];})(req);
