const { doit_projects, doit_path, doit_profile } = require("./constants");
const fs = require("fs");
const readline = require("readline-sync");
const path = require("path");

class Project {
  constructor() {
    this.file = doit_projects;
    this.data = JSON.parse(fs.readFileSync(this.file, { encoding: "utf-8" }));
    this.projects = this.data.projects;
  }

  haveProjects = () => {
    return this.projects.length > 0;
  };

  addProject = () => {
    let name = readline.question("Project Name : ", {
      limit: (input) => {
        return input.length > 0 && this.getProjectNames().indexOf(input) < 0;
      },
      limitMessage: "Project Exist Or Invalid Input",
    });

    let desc = readline.question("Description : ", {
      limit: (input) => {
        return input.length > 10;
      },
      limitMessage: "Should be Grater Then 10 Characters",
    });


    let id = this.createID();
    this.data.projects.push({
      id: id,
      doing: false,
      defualt: false,
      desc: desc,
      name: name,
    });

    this.createBoard(id);

    this.save();
  };

  createBoard = (id) => {
    fs.writeFileSync(
      path.join(doit_path, `${id}.json`),
      JSON.stringify({
        do: [],
        doing: [],
        done: [],
      })
    );
  };

  createID = () => {
    let id = parseInt(Math.random() * 100000);
    while (this.getIds().indexOf(id) >= 0) {
      id = parseInt(Math.random() * 100000);
    }
    return id;
  };

  getIds = () => {
    let storage = [];
    for (let i of this.data.projects) {
      storage.push(i.id);
    }
    return storage;
  };

  save = () => {
    fs.writeFileSync(doit_projects, JSON.stringify(this.data));
  };

  getProjectsNameWithDesc = () => {
    let storage = [];
    for(let i of this.data.projects){
      storage.push([i.name, i.desc]);
    }
    return storage;
  }

  getProjectNames = () => {
    let storage = [];
    for (let i of this.data.projects) {
      storage.push(i.name);
    }
    return storage;
  };

  setDefault = () => {
    let def = readline.keyInSelect(
      this.getProjectNames(),
      "Select Default Project"
    );

    let name = this.getProjectNames()[def];
    for (let i of this.data.projects) {
      if (i.name == name) {
        i.defualt = true;
      } else {
        i.defualt = false;
      }
    }
    this.save();
  };

  deleteProject = () => {
    let def = readline.keyInSelect(
      this.getProjectNames(),
      "Select Project to Delete"
    );

    let name = this.getProjectNames()[def];

    for (let i = 0; i < this.data.projects.length; i++) {
      if (this.data.projects[i].name == name) {
        this.data.projects.splice(i, 1);
      }
    }
    this.save();
  };

  showDefault() {
    let def = this.getDefault();
    console.log(def ? def : "* No Default Set");
  }

  getDefault() {
    for (let i of this.data.projects) {
      if (i.defualt) {
        return i.name;
      }
    }
  }

  showProject = () => {
    for (let i of this.getProjectsNameWithDesc()) {
      console.log(`${i[0]} - ${i[1]}`);
    }
  }

  setDoing = () => {
    let projects = this.getProjectNames();
    let profile = JSON.parse(fs.readFileSync(doit_profile, { encoding: 'utf-8' }));
    let time = profile.minutes;
    let _storage = [];

    // No Projects
    if (!projects.length) {
      console.log("No Project Exists");
      process.exit(0);
    }

    //Only Projects
    if (projects.length == 1) {
      console.log(`Only Project [${projects[0]}]: Minutes[${time}]`)
      _storage.push({ name: projects[0], minutes: time })
      process.exit(0);
    }


    while (time > 0) {
      let select = readline.keyInSelect(projects, "Select Project");
      if (select < 0) {
        process.exit(0);
      }
      let time_ask = readline.questionInt(`Minutes for [${projects[select]}] : `, {
        limit: (input) => {
          return input <= time;
        }, limitMessage: `Only ${time} Remained`
      });

      let removed = projects.splice(select, 1);
      time -= time_ask;
      _storage.push({name: removed[0], minutes: time_ask });

      // Only Project
      if (projects.length == 1 && time > 0) {
        console.log(`Only Project [${projects[0]}]: Minutes[${time}]`)
        _storage.push({ name: projects[0], minutes: time })
        break;
      }
    }
    this.processDoingSelection(_storage);
  }

  processDoingSelection(data) {
    for(let i of data) {
      console.log(i)
      for(let j = 0; j < this.data.projects.length ; j++) {
        if(i.name == this.data.projects[j].name){
          this.data.projects[j].doing = true,
          this.data.projects[j].time = i.minutes
        }else {
          this.data.projects[j].doing = false,
          this.data.projects[j].time = 0;
        }
      } 
    }
    this.save();
  }

  today = () => {
    
  }
}

module.exports = Project;
