const path = require("path"),
  home = require("os").homedir(), // Home Directory
  doit_path = path.join(home, ".doit"), // Doit Foler for Configurations
  doit_profile = path.join(doit_path, "profile.json"), // Doit Profile File
  doit_projects = path.join(doit_path, "project.json"), // Doit Projects File
  doit_tags = path.join(doit_path, "tags.json"); // Doit Tags File

module.exports = {
  home: home,
  doit_path: doit_path,
  doit_profile: doit_profile,
  doit_projects: doit_projects,
  doit_tags: doit_tags,
};
