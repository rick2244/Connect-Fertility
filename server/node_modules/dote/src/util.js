const readline = require("readline-sync");
const fs = require("fs");
const { doit_profile } = require("./constants");
const { MinutesInDayMessage, WhatIsNameMessage } = require("./messages");
const  version  = require("./version");

function setProfile() {
  const name = readline.question(WhatIsNameMessage, {
    defaultInput: "doit-user",
  });
  const time_value = readline.questionInt(MinutesInDayMessage);
  fs.writeFileSync(
    doit_profile,
    JSON.stringify({
      name: name,
      minutes: time_value,
    })
  );
}

function printUsage() {
  console.log(
    `Usage: doit [options]
Options:
    set   : For Setting Profile Or Default Project
    add   : For Adding Task, Board, Project etc.
    move  : For moving Tasks in Boards
    delete: For Deleting Task, Boards...
    show  : For Listing
`
  );
}

function printSetUsage() {
  console.log(
    `Usage: doit set [options]
Options:
    profile   : For Setting Your Profile
    default   : For Setting Your Default Project
`
  );
}

function printAddUsage() {
  console.log(
    `Usage: doit add [options]
Options:
    project : For Adding Project
    task    : For Adding Task to Default Project
`
  );
}

function printDeleteUsage() {
  console.log(
    `Usage: doit delete [options]
Options:
    project : For Deleting Project
    task    : For Deleting Task to Default Project
`
  );
}

function printShowUsage() {
  console.log(
    `Usage: doit show [options]
Options:
    project : Shows Projects
    default : Shows Default Project
    task    : Shows Tasks from Board
    profile : Shows Profile
    board   : Shows Board
    version : Prints Version
`
  );
}

function printMoveUsage() {
  console.log(
    `Usage: doit move [options]
Options:
    task    : For Moving Task Around Boards
`
  );
}

printAndExit = (message) => {
  console.log(message);
  process.exit(0);
};

printVersion = () => {
  console.log(version);
}

module.exports = {
  setProfile,
  printUsage,
  printSetUsage,
  printAndExit,
  printAddUsage,
  printDeleteUsage,
  printShowUsage,
  printMoveUsage,
  printVersion
};
