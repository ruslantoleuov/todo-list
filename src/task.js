"use strict";

const Task = function (
  id,
  title,
  description,
  dueDate,
  priority,
  isDone = false
) {
  return {
    id,
    title,
    description,
    dueDate,
    priority,
    isDone,
  };
};

export { Task as default };
