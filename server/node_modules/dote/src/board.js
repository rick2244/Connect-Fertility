const readline = require("readline-sync");
const fs = require("fs");
const { doit_projects, doit_path } = require("./constants");
const Tags = require("./tags");
const path = require("path");

/**
 * Board!!
 * -------
 */

class Board {
  setDefaultProjectMessage = "Please 🙏 Set Default Project";
  whichBoard = "Which Board 🤔 : ";
  whichDelete = "Which One to Delete 🗑️: ";
  SelectOnlyOne = "Select only one ✔️: ";
  boardOptions = ["do", "done", "doing"];
  cancelledMessage = "❌ Cancelled";

  constructor() {
    this.default = this.getDefault();
    this.path = path.join(doit_path, `${this.default}.json`);
    this.data = JSON.parse(fs.readFileSync(this.path, { encoding: "utf-8" }));
    this.tags = new Tags();
  }

  getDefault = () => {
    let data = JSON.parse(
      fs.readFileSync(doit_projects, { encoding: "utf-8" })
    );

    let projects = data.projects;
    for (let i of projects) {
      if (i.defualt == true) {
        return i.id;
      }
    }
    console.log(this.setDefaultProjectMessage);
    process.exit(0);
  };

  addTask = () => {
    let board = readline.question(this.whichBoard, {
      limit: this.boardOptions,
      limitMessage: this.SelectOnlyOne,
    });

    let task = readline.question("Name Task : ", {
      limit: (value) => {
        return this.getTasksFromBoard(board).indexOf(value) < 0;
      },
      limitMessage: "Task Already Exist",
    });
    let id = this.createID();
    let time = readline.questionInt("How much Time it Should Take: ");
    let cost = readline.questionInt("How much Cost it Should Take: ");
    let priority = readline.question("Priority: ", {
      limit: ["low", "mid", "high"],
    });
    let tags = readline.keyInSelect(this.tags.getTags(), "Select Tag");
    tags = tags == -1 ? [] : tags;

    this.data[board].push({
      id: id,
      name: task,
      time: time,
      cost: cost,
      priority: priority,
      tag: tags,
    });

    this.save();
  };

  moveTask = () => {
    let eg_boards = ["do", "doing", "done"];
    let board = readline.question("Source Board: ", {
      limit: eg_boards,
      limitMessage: "Can be Only One",
    });

    if (board < 0) {
      console.log("Cancelled");
      process.exit(0);
    }

    let dest_board = readline.question("Destination Board: ", {
      limit: ["do", "doing", "done"].filter((val) => val != eg_boards[board]),
      limitMessage: "Can be Only One",
    });

    if (dest_board < 0) {
      console.log("Cancelled");
      process.exit(0);
    }

    let tasks = this.getTasksFromBoard(board);
    if (!tasks.length) {
      console.log("No Task to Move!!");
      process.exit(0);
    }

    this.consoleInputinList(tasks);

    let ans = readline.question("Enter Tasks in Comma Eg[1,2,3] : ", {
      limit: (input) => {
        input = input.split(",").map((value) => parseInt(value));
        return !this.containsNaNAnsSmaller(input);
      },
      limitMessage: "Can be only Number & should be in Range",
    });

    let arr = ans.split(",").map((value) => parseInt(value));

    if (arr.indexOf(0) > 0) {
      console.log("Cancelledl");
      process.exit(0);
    }

    arr = arr.map((val) => tasks[val - 1]);

    this._processMove(arr, board, dest_board);
  };

  _processMove(arr, source, dest) {
    for (let i of arr) {
      for (let j = 0; j < this.data[source].length; j++) {
        if (i == this.data[source][j].name) {
          this.data[dest].push(this.data[source].splice(j, 1)[0]);
        }
      }
    }

    this.save();
  }

  containsNaNAnsSmaller = (input) => {
    for (let i of input) {
      if (i == NaN || i > input.length || i < 0) {
        return true;
      }
    }
    return false;
  };

  consoleInputinList = (data) => {
    data.forEach((element, index) => {
      console.log(`[${index + 1}] ${element}`);
    });

    console.log(`[0] Cancel`);
  };

  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  getTasksFromBoard(board) {
    let _storage = [];
    let tasks = this.data[board];
    for (let i of tasks) {
      _storage.push(i.name);
    }
    return _storage;
  }

  createID = () => {
    let id = parseInt(Math.random() * 100000);
    while (this.getIds().indexOf(id) >= 0) {
      id = parseInt(Math.random() * 100000);
    }
    return id;
  };

  deleteTask = () => {
    let board = readline.question("Which Board: ", {
      limit: ["do", "doing", "done"],
      limitMessage: "Can be Only One",
    });
    let tasks = this.getTasksFromBoard(board);
    if (!tasks.length) {
      console.log(`No task in [${board}]`);
      process.exit(0);
    }

    let which = readline.keyInSelect(tasks, "Which One to Delete ? : ");
    if (which < 0) {
      console.log("Cancelled ? ");
      process.exit(0);
    }

    let task = tasks[which];

    for (let i = 0; i < this.data[board].length; i++) {
      if (this.data[board][i].name == task) {
        this.data[board].splice(i, 1);
      }
    }
    this.save();
  };

  getIds() {
    let _storage = [];
    for (let i of this.data.do) {
      _storage.push(i.id);
    }

    for (let i of this.data.doing) {
      _storage.push(i.id);
    }

    for (let i of this.data.done) {
      _storage.push(i.id);
    }
    return _storage;
  }

  showTasks = () => {
    let board = readline.question(this.whichBoard, {
      limit: this.boardOptions,
      limitMessage: this.SelectOnlyOne,
    });

    if (board < 0) {
      console.log(this.cancelledMessage);
      process.exit(0);
    }

    let tasks = this.getTasksFromBoard(board);
    tasks.forEach((el) => console.log(el));
  };

  showBoard = () => {
    let doe = this.getTasksFromBoard("do");
    let doing = this.getTasksFromBoard("doing");
    let done = this.getTasksFromBoard("done");

    let max = Math.max(
      ...doe.map((val) => val.length),
      ...doing.map((val) => val.length),
      ...done.map((val) => val.length)
    );

    let maxarr = Math.max(doe.length, doing.length, done.length);

    let total = max * 3 + 6

    console.log('-'.repeat(total))
    console.log(this._PadString("Do", max) + this._PadString("Doing", max) + this._PadString("Done", max))
      console.log('-'.repeat(total));
    for(let i = 0; i<maxarr; i++){
      let doe_el = doe[i];
      let doing_el = doing[i];
      let done_el = done[i];
      console.log(this._PadString(doe_el, max) + this._PadString(doing_el, max) + this._PadString(done_el, max))
      console.log('-'.repeat(total));
    }
  };

  _PadString(item, max) {
    if(!item) {
      return `|${' '.padEnd(max)}|`;
    }
    return `|${item.padEnd(max, ' ')}|`
  }
}

module.exports = Board;
