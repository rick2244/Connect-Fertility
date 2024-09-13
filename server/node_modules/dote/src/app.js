#!/usr/bin/env node
const {
  home,
  doit_path,
  doit_profile,
  doit_projects,
  doit_tags,
} = require("./constants");
const fs = require("fs");
const {
  setProfile,
  printUsage,
  printSetUsage,
  printAndExit,
  printAddUsage,
  printDeleteUsage,
  printShowUsage,
  printMoveUsage,
  printVersion,
} = require("./util");
const Argv = require("./argv");
const version = require("./version");
const Project = require("./projects");
const Tags = require("./tags");
const Board = require("./board");
const { cannotAccessHomeMessage } = require("./messages");

// Cannot Access Home Folder
if (!fs.existsSync(home)) {
  printAndExit(cannotAccessHomeMessage);
}

// Create doit Directory if not
if (!fs.existsSync(doit_path)) {
  fs.mkdir(doit_path, { recursive: false }, (error) => {
    if (error) {
      console.error(error);
      process.exit(0);
    }
  });
}

// Set profile if not
if (!fs.existsSync(doit_profile)) {
  setProfile();
}

// Add simple File
if (!fs.existsSync(doit_projects)) {
  fs.writeFileSync(
    doit_projects,
    JSON.stringify({ doit_version: version, projects: [] })
  );
}

// Stringify Write
if (!fs.existsSync(doit_tags)) {
  fs.writeFileSync(doit_tags, JSON.stringify({}));
}

let project = new Project();
let args = new Argv();
let tags = new Tags();

let doit = () => {

  // State Based if Else
  if (args.current("set")) {
    if (args.current("profile")) {
      setProfile();
    } else if (args.current("default")) {
      project.setDefault();
    } else if (args.current("doing")) {
      project.setDoing();
    } else {
      printSetUsage();
    }
  } else if (args.current("add")) {
    // if (args.current("tag")) {
    //   tags.addTag();
    // } else 
    if (args.current("project")) {
      project.addProject();
    } else if (args.current("task")) {
      let board = new Board();
      board.addTask();
    } else {
      printAddUsage();
    }
  } else if (args.current("delete")) {
    // if (args.current("tags")) {
    //   tags.delete();
    // } else 

    if (args.current("project")) {
      project.deleteProject();
    } else if (args.current("task")) {
      let board = new Board();
      board.deleteTask();
    } else {
      printDeleteUsage();
    }
  } else if (args.current("show")) {
    // if (args.current("tag")) {
    //   tags.show();
    // } else 
    if (args.current("project")) {
      project.showProject();
    } else if (args.current("default")) {
      project.showDefault();
    } else if (args.current("profile")) {
      let s = JSON.parse(fs.readFileSync(doit_profile, { encoding: "utf-8" }));
      console.log(s.name, `| Minutes: ${s.minutes}`);
    } else if (args.current("task")) {
      let board = new Board();
      board.showTasks();
    } else if (args.current("board")) {
      let board = new Board();
      board.showBoard();
    } else if (args.current("version")) {
      printVersion()
    } else {
      printShowUsage();
    }
  } else if (args.current("move")) {
    if (args.current("task")) {
      let board = new Board();
      board.moveTask();
    } else {
      printMoveUsage()
    }
  } else {
    printUsage();
  }
}

module.exports = doit;