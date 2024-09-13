const { doit_tags } = require("./constants");
const fs = require("fs");
const readline = require("readline-sync");
let colors = require('./colors');

class Tags {
  colors = [];
  constructor() {
    this.data = JSON.parse(fs.readFileSync(doit_tags, { encoding: "utf-8" }));
  }

  addTag = () => {
    let name = readline.question("Enter Tag Name : ", {
      limit: function (input) {
        return input.length > 0;
      },
      limitMessage: "Please Enter name",
    });

    let color = readline.question("Color : ", {
      limit: colors,
    });

    if (Object.keys(this.data).indexOf(name) >= 0) {
      console.log("Key Already Exist Please Delete it And Readd it");
    } else {
      this.data[name] = color;
      this.save();
    }
  };

  delete() {
    let keys = Object.keys(this.data);
    let key = readline.keyInSelect(keys);
    delete this.data[keys[key]];
    this.save();
  }

  show() {
    let tags = Object.keys(this.data);
    for (let i of tags) {
      console.log(i);
    }
  }

  getTags() {
    return Object.keys(this.data);
  }

  save = () => {
    fs.writeFileSync(doit_tags, JSON.stringify(this.data));
  };
}

module.exports = Tags;
