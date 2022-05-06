"use strict";

const Project = function (projectName, projectId) {
  return {
    projectName,
    projectId,
    projectToDo: [],
  };
};

export { Project as default };
