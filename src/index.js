"use strict";

import { isThisWeek, isToday } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import TodoList from "./todolist";
import Task from "./task";
import Project from "./project";

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const containerEl = document.getElementById("container");

    containerEl.innerHTML = `
    <div class="modal">
      <div class="modal-details hide">
        <div class="modal-titlebar">
          <span>Details</span>
          <svg class="modal-titlebar-logo" viewBox="0 0 24 24">
            <path
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
        </div>
        <div class="modal-details-text"></div>
      </div>
      <form class="modal-form-container hide">
        <div class="modal-titlebar">
          <span>Create a new task</span>
          <svg class="modal-titlebar-logo" viewBox="0 0 24 24">
            <path
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
        </div>
        <div class="modal-form">
          <input
            class="modal-form-title"
            type="text"
            placeholder="Title: Pay bills"
            maxlength="40"
            required
          />
          <textarea
            class="modal-form-textarea"
            placeholder="Details: e.g. internet, phone, rent."
          ></textarea>
          <div class="modal-form-date">
            <label for="modal-form-date-calendar">Due Date:</label>
            <input id="modal-form-date-calendar" type="date" required />
          </div>
          <div class="modal-group-buttons">
            <div class="modal-form-radio">
              <span class="modal-form-radio-title">Priority:</span>
              <input
                type="radio"
                id="low"
                value="low"
                name="form-radio"
                checked
              />
              <label for="low">Low</label>
              <input
                type="radio"
                id="medium"
                value="medium"
                name="form-radio"
              />
              <label for="medium">Medium</label>
              <input type="radio" id="high" value="high" name="form-radio" />
              <label for="high">High</label>
            </div>
            <button class="modal-form-add-button" type="submit">
              Add Task
            </button>
          </div>
        </div>
      </form>
    </div>
    <header class="header">
      <svg class="header-logo" viewBox="0 0 24 24">
        <path
          d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z"
        />
      </svg>
    </header>
    <aside class="aside">
      <div class="aside-due-dates">
        <div class="aside-due-dates-inbox selected">
          <svg class="aside-logo" viewBox="0 0 24 24">
            <path
              d="M19,15H15A3,3 0 0,1 12,18A3,3 0 0,1 9,15H5V5H19M19,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z"
            />
          </svg>
          <span>Inbox</span>
        </div>
        <div class="aside-due-dates-today">
          <svg class="aside-logo" viewBox="0 0 24 24">
            <path
              d="M7,10H12V15H7M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z"
            />
          </svg>
          <span>Today</span>
        </div>
        <div class="aside-due-dates-this-week">
          <svg class="aside-logo" viewBox="0 0 24 24">
            <path
              d="M6 1H8V3H16V1H18V3H19C20.11 3 21 3.9 21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.89 3.89 3 5 3H6V1M5 8V19H19V8H5M7 10H17V12H7V10Z"
            />
          </svg>
          <span>This week</span>
        </div>
      </div>
      <div class="aside-projects">
        <span class="aside-projects-title">Projects</span>
        <div class="aside-projects-container"></div>
        <button class="aside-projects-add-prj-btn" type="button">
          <svg class="aside-logo" viewBox="0 0 24 24">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          <span>Add Project</span>
        </button>
        <div class="aside-projects-create hide">
          <input class="aside-projects-input" type="text" />
          <div class="aside-projects-buttons">
            <button
              class="aside-projects-btn aside-projects-cancel-btn"
              type="button"
            >
              Cancel
            </button>
            <button
              class="aside-projects-btn aside-projects-add-btn"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </aside>
    <main class="main"></main>
    <button class="add-btn" type="button">
      <svg class="add-logo" viewBox="0 0 24 24">
        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
      </svg>
    </button>
    <footer class="footer">
      Copyright &copy; 2022 Ruslan Toleuov
      <a
        href="https://github.com/ruslantoleuov"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg class="github-icon" viewBox="0 0 20 19.51549">
          <path
            d="M 10,0 A 10,10 0 0 0 0,10 c 0,4.42 2.87,8.17 6.84,9.5 0.5,0.08 0.66,-0.23 0.66,-0.5 0,-0.23 0,-0.86 0,-1.69 C 4.73,17.91 4.14,15.97 4.14,15.97 3.68,14.81 3.03,14.5 3.03,14.5 2.12,13.88 3.1,13.9 3.1,13.9 c 1,0.07 1.53,1.03 1.53,1.03 C 5.5,16.45 6.97,16 7.54,15.76 7.63,15.11 7.89,14.67 8.17,14.42 5.95,14.17 3.62,13.31 3.62,9.5 3.62,8.39 4,7.5 4.65,6.79 4.55,6.54 4.2,5.5 4.75,4.15 c 0,0 0.84,-0.27 2.75,1.02 0.79,-0.22 1.65,-0.33 2.5,-0.33 0.85,0 1.71,0.11 2.5,0.33 1.91,-1.29 2.75,-1.02 2.75,-1.02 0.55,1.35 0.2,2.39 0.1,2.64 0.65,0.71 1.03,1.6 1.03,2.71 0,3.82 -2.34,4.66 -4.57,4.91 0.36,0.31 0.69,0.92 0.69,1.85 0,1.34 0,2.42 0,2.74 0,0.27 0.16,0.59 0.67,0.5 C 17.14,18.16 20,14.42 20,10 A 10,10 0 0 0 10,0 Z"
          />
        </svg>
      </a>
    </footer>
    `;

    // DOM Cache

    const mainEl = containerEl.querySelector(".main");
    const asideEl = containerEl.querySelector(".aside");
    const asideProjectsEl = asideEl.querySelector(".aside-projects");
    const asideDueDatesEl = asideEl.querySelector(".aside-due-dates");
    const asideDueDatesInbox = asideDueDatesEl.querySelector(
      ".aside-due-dates-inbox"
    );
    const asideProjectsContainerEl = asideEl.querySelector(
      ".aside-projects-container"
    );
    const asideProjectsAddPrjBtnEl = asideProjectsEl.querySelector(
      ".aside-projects-add-prj-btn"
    );
    const asideProjectsCreateEl = asideProjectsEl.querySelector(
      ".aside-projects-create"
    );
    const asideProjectsInputEl = asideProjectsCreateEl.querySelector(
      ".aside-projects-input"
    );
    const addBtnEl = document.querySelector(".add-btn");
    const modalEl = containerEl.querySelector(".modal");
    const modalDetailsEl = modalEl.querySelector(".modal-details");
    const modalDetailsTextEl = modalDetailsEl.querySelector(
      ".modal-details-text"
    );
    const modalFormContainerEl = modalEl.querySelector(".modal-form-container");
    const modalTitlebarEl = modalFormContainerEl.querySelector(
      ".modal-titlebar span"
    );
    const modalFormEl = modalFormContainerEl.querySelector(".modal-form");
    const modalFormTitleInput =
      modalFormContainerEl.querySelector(".modal-form-title");
    const modalFormTextareaEl = modalFormContainerEl.querySelector(
      ".modal-form-textarea"
    );
    const modalFormDateCalendar = document.getElementById(
      "modal-form-date-calendar"
    );
    const modalFormAddButton = modalFormContainerEl.querySelector(
      ".modal-form-add-button"
    );

    let choosedAsideEl = asideDueDatesInbox;
    let choosedTaskEl;

    // Functions

    const useLocalStorage = function () {
      localStorage.setItem(
        "defaultProject",
        JSON.stringify(TodoList.defaultProject)
      );
      localStorage.setItem("projects", JSON.stringify(TodoList.projects));
    };

    const renderTask = function (task) {
      const divEl = document.createElement("div");
      divEl.dataset.id = task.id;
      divEl.classList.add("main-todo");
      divEl.classList.add(`priority-${task.priority}`);
      divEl.innerHTML = `
      <div class="main-todo-title">
        <input class="main-todo-checkbox" type="checkbox" ${
          task.isDone ? "checked" : ""
        } />
        <span>${task.title}</span>
      </div>
      <div class="main-todo-controls-container">
        <span class="main-todo-details">details</span>
        <span class="main-todo-duedate">${task.dueDate}</span>
        <svg class="main-todo-logo logo-edit" viewBox="0 0 24 24">
          <path
            d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"
          />
        </svg>
        <svg class="main-todo-logo logo-delete" viewBox="0 0 24 24">
          <path
            d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
          />
        </svg>
      </div>
      `;

      mainEl.appendChild(divEl);
    };

    const renderAllTasks = function (el) {
      mainEl.innerHTML = "";

      if (
        el.classList.contains("aside-due-dates-inbox") ||
        el.closest(".aside-due-dates-inbox")
      ) {
        if (TodoList.defaultProject) {
          for (const task of TodoList.defaultProject) {
            renderTask(task);
          }
        }
      }

      if (
        el.classList.contains("aside-due-dates-today") ||
        el.closest(".aside-due-dates-today")
      ) {
        if (TodoList.defaultProject) {
          for (const task of TodoList.defaultProject) {
            if (isToday(new Date(task.dueDate))) {
              renderTask(task);
            }
          }
        }
      }

      if (
        el.classList.contains("aside-due-dates-this-week") ||
        el.closest(".aside-due-dates-this-week")
      ) {
        if (TodoList.defaultProject) {
          for (const task of TodoList.defaultProject) {
            if (isThisWeek(new Date(task.dueDate), { weekStartsOn: 1 })) {
              renderTask(task);
            }
          }
        }
      }

      if (
        el.classList.contains("aside-project") ||
        el.closest(".aside-project")
      ) {
        if (TodoList.projects) {
          for (const project of TodoList.projects) {
            if (project.projectId === el.closest(".aside-project").dataset.id) {
              for (const task of project.projectToDo) {
                renderTask(task);
              }
            }
          }
        }
      }
    };

    const renderProject = function (project) {
      const divEl = document.createElement("div");
      divEl.dataset.id = project.projectId;
      divEl.classList.add("aside-project");
      divEl.innerHTML = `
      <svg class="aside-project-logo" viewBox="0 0 24 24">
        <path
          d="M21,19V17H8V19H21M21,13V11H8V13H21M8,7H21V5H8V7M4,5V7H6V5H4M3,5A1,1 0 0,1 4,4H6A1,1 0 0,1 7,5V7A1,1 0 0,1 6,8H4A1,1 0 0,1 3,7V5M4,11V13H6V11H4M3,11A1,1 0 0,1 4,10H6A1,1 0 0,1 7,11V13A1,1 0 0,1 6,14H4A1,1 0 0,1 3,13V11M4,17V19H6V17H4M3,17A1,1 0 0,1 4,16H6A1,1 0 0,1 7,17V19A1,1 0 0,1 6,20H4A1,1 0 0,1 3,19V17Z"
        />
      </svg>
      <span>${project.projectName}</span>
      <svg class="aside-project-remove-logo" viewBox="0 0 24 24">
        <path
          d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
        />
      </svg>
      `;

      asideProjectsContainerEl.appendChild(divEl);
    };

    const addTaskToProject = function (project) {
      project.push(
        Task(
          uuidv4(),
          modalFormTitleInput.value,
          modalFormTextareaEl.value,
          modalFormDateCalendar.value,
          modalFormEl.querySelector('input[name="form-radio"]:checked').value
        )
      );

      useLocalStorage();
    };

    const confirmEdit = function (task) {
      if (task.id === choosedTaskEl.dataset.id) {
        task.title = modalFormTitleInput.value;
        task.description = modalFormTextareaEl.value;
        task.dueDate = modalFormDateCalendar.value;
        task.priority = modalFormEl.querySelector(
          'input[name="form-radio"]:checked'
        ).value;

        choosedTaskEl.querySelector("label").textContent = task.title;

        if (choosedTaskEl.classList.contains("priority-low")) {
          choosedTaskEl.classList.remove("priority-low");
        } else if (choosedTaskEl.classList.contains("priority-medium")) {
          choosedTaskEl.classList.remove("priority-medium");
        } else if (choosedTaskEl.classList.contains("priority-high")) {
          choosedTaskEl.classList.remove("priority-high");
        }

        choosedTaskEl.classList.add(`priority-${task.priority}`);

        choosedTaskEl.querySelector(".main-todo-duedate").textContent =
          task.dueDate;

        useLocalStorage();
      }
    };

    const changeIsDoneStatus = function (task, target) {
      if (task.id === target.closest(".main-todo").dataset.id) {
        task.isDone = target.checked;
      }
    };

    const deleteTask = function (task, taskIndex, project, target) {
      if (task.id === target.closest(".main-todo").dataset.id) {
        target.closest(".main-todo").remove();
        project.splice(taskIndex, 1);
      }
    };

    const deleteProject = function (target, index) {
      target.closest(".aside-project").remove();
      TodoList.projects.splice(index, 1);
    };

    const showTaskContentsInModal = function (task, target) {
      if (task.id === target.closest(".main-todo").dataset.id) {
        choosedTaskEl = target.closest(".main-todo");
        modalFormTitleInput.value = task.title;
        modalFormTextareaEl.value = task.description;
        modalFormDateCalendar.value = task.dueDate;
        modalFormEl.querySelector(
          `input[value="${task.priority}"]`
        ).checked = true;
      }
    };

    const showModalDetailsText = function (task, target) {
      if (task.id === target.closest(".main-todo").dataset.id) {
        modalDetailsTextEl.textContent = task.description;
      }
    };

    const changeSelectedElStyle = function (el) {
      for (const child of asideProjectsContainerEl.children) {
        child.classList.remove("selected");
      }

      for (const child of asideDueDatesEl.children) {
        child.classList.remove("selected");
      }

      el.classList.add("selected");
    };

    const showModal = function (el) {
      modalEl.classList.add("show");
      el.classList.remove("hide");
    };

    const clearModal = function () {
      if (!modalDetailsEl.classList.contains("hide")) {
        modalDetailsEl.classList.add("hide");
      }

      if (!modalFormContainerEl.classList.contains("hide")) {
        modalFormContainerEl.classList.add("hide");
      }

      modalDetailsTextEl.textContent = "";
      modalEl.classList.remove("show");
      modalTitlebarEl.textContent = "Create a new task";
      modalFormAddButton.textContent = "Add Task";
    };

    // Init

    const init = function () {
      if (JSON.parse(localStorage.getItem("defaultProject"))) {
        for (const task of JSON.parse(localStorage.getItem("defaultProject"))) {
          TodoList.defaultProject.push(task);
          renderTask(task);
        }
      }

      if (JSON.parse(localStorage.getItem("projects"))) {
        for (const project of JSON.parse(localStorage.getItem("projects"))) {
          TodoList.projects.push(project);
          renderProject(project);
        }
      }
    };

    init();

    // Events

    asideEl.addEventListener("click", function (e) {
      if (e.target.closest(".aside-projects-add-prj-btn")) {
        asideProjectsAddPrjBtnEl.classList.add("hide");
        asideProjectsCreateEl.classList.remove("hide");
      }

      if (e.target.closest(".aside-projects-cancel-btn")) {
        asideProjectsCreateEl.classList.add("hide");
        asideProjectsAddPrjBtnEl.classList.remove("hide");
        asideProjectsInputEl.value = "";
      }

      if (e.target.closest(".aside-projects-add-btn")) {
        if (asideProjectsInputEl.value) {
          TodoList.projects.push(Project(asideProjectsInputEl.value, uuidv4()));

          renderProject(TodoList.projects[TodoList.projects.length - 1]);

          asideProjectsCreateEl.classList.add("hide");
          asideProjectsAddPrjBtnEl.classList.remove("hide");
          asideProjectsInputEl.value = "";

          useLocalStorage();
        }
      }

      if (
        e.target.classList.contains("aside-due-dates-inbox") ||
        e.target.closest(".aside-due-dates-inbox")
      ) {
        choosedAsideEl = e.target.closest(".aside-due-dates-inbox");
        changeSelectedElStyle(choosedAsideEl);
        renderAllTasks(e.target);
      }

      if (
        e.target.classList.contains("aside-due-dates-today") ||
        e.target.closest(".aside-due-dates-today")
      ) {
        choosedAsideEl = e.target.closest(".aside-due-dates-today");
        changeSelectedElStyle(choosedAsideEl);
        renderAllTasks(e.target);
      }

      if (
        e.target.classList.contains("aside-due-dates-this-week") ||
        e.target.closest(".aside-due-dates-this-week")
      ) {
        choosedAsideEl = e.target.closest(".aside-due-dates-this-week");
        changeSelectedElStyle(choosedAsideEl);
        renderAllTasks(e.target);
      }

      if (
        e.target.classList.contains("aside-project") ||
        e.target.closest(".aside-project")
      ) {
        choosedAsideEl = e.target.closest(".aside-project");
        changeSelectedElStyle(choosedAsideEl);
        renderAllTasks(e.target);
      }

      if (
        e.target.classList.contains("aside-project-remove-logo") ||
        e.target.closest(".aside-project-remove-logo")
      ) {
        if (
          choosedAsideEl.classList.contains("aside-due-dates-inbox") ||
          choosedAsideEl.classList.contains("aside-due-dates-today") ||
          choosedAsideEl.classList.contains("aside-due-dates-this-week")
        ) {
          for (const [index, project] of TodoList.projects.entries()) {
            if (
              project.projectId ===
              e.target.closest(".aside-project").dataset.id
            ) {
              deleteProject(e.target, index);
            }
          }
        } else if (choosedAsideEl.classList.contains("aside-project")) {
          for (const [index, project] of TodoList.projects.entries()) {
            if (
              project.projectId ===
              e.target.closest(".aside-project").dataset.id
            ) {
              deleteProject(e.target, index);
              choosedAsideEl = asideDueDatesInbox;
              changeSelectedElStyle(asideDueDatesInbox);
              renderAllTasks(asideDueDatesInbox);
            }
          }
        }

        useLocalStorage();
      }
    });

    mainEl.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("logo-edit") ||
        e.target.closest(".logo-edit")
      ) {
        if (
          choosedAsideEl.classList.contains("aside-due-dates-inbox") ||
          choosedAsideEl.classList.contains("aside-due-dates-today") ||
          choosedAsideEl.classList.contains("aside-due-dates-this-week")
        ) {
          for (const task of TodoList.defaultProject) {
            showTaskContentsInModal(task, e.target);
          }
        } else if (choosedAsideEl.classList.contains("aside-project")) {
          for (const project of TodoList.projects) {
            for (const task of project.projectToDo) {
              showTaskContentsInModal(task, e.target);
            }
          }
        }

        modalTitlebarEl.textContent = "Edit";
        modalFormAddButton.textContent = "Confirm";
        showModal(modalFormContainerEl);
      }

      if (
        e.target.classList.contains("logo-delete") ||
        e.target.closest(".logo-delete")
      ) {
        if (
          choosedAsideEl.classList.contains("aside-due-dates-inbox") ||
          choosedAsideEl.classList.contains("aside-due-dates-today") ||
          choosedAsideEl.classList.contains("aside-due-dates-this-week")
        ) {
          for (const [taskIndex, task] of TodoList.defaultProject.entries()) {
            deleteTask(task, taskIndex, TodoList.defaultProject, e.target);
          }
        } else if (choosedAsideEl.classList.contains("aside-project")) {
          for (const project of TodoList.projects) {
            if (project.projectId === choosedAsideEl.dataset.id) {
              for (const [taskIndex, task] of project.projectToDo.entries()) {
                deleteTask(task, taskIndex, project.projectToDo, e.target);
              }
            }
          }
        }

        useLocalStorage();
      }

      if (e.target.classList.contains("main-todo-details")) {
        if (
          choosedAsideEl.classList.contains("aside-due-dates-inbox") ||
          choosedAsideEl.classList.contains("aside-due-dates-today") ||
          choosedAsideEl.classList.contains("aside-due-dates-this-week")
        ) {
          for (const task of TodoList.defaultProject) {
            showModalDetailsText(task, e.target);
          }
        } else if (choosedAsideEl.classList.contains("aside-project")) {
          for (const project of TodoList.projects) {
            for (const task of project.projectToDo) {
              showModalDetailsText(task, e.target);
            }
          }
        }

        showModal(modalDetailsEl);
      }

      if (e.target.classList.contains("main-todo-checkbox")) {
        if (
          choosedAsideEl.classList.contains("aside-due-dates-inbox") ||
          choosedAsideEl.classList.contains("aside-due-dates-today") ||
          choosedAsideEl.classList.contains("aside-due-dates-this-week")
        ) {
          for (const task of TodoList.defaultProject) {
            changeIsDoneStatus(task, e.target);
          }
        } else if (choosedAsideEl.classList.contains("aside-project")) {
          for (const project of TodoList.projects) {
            for (const task of project.projectToDo) {
              changeIsDoneStatus(task, e.target);
            }
          }
        }

        useLocalStorage();
      }
    });

    addBtnEl.addEventListener("click", function () {
      showModal(modalFormContainerEl);
    });

    modalFormAddButton.addEventListener("click", function () {
      if (modalFormAddButton.textContent.toLowerCase().trim() === "add task") {
        if (modalFormTitleInput.value && modalFormDateCalendar.value) {
          if (choosedAsideEl.classList.contains("aside-due-dates-inbox")) {
            addTaskToProject(TodoList.defaultProject);
            renderTask(
              TodoList.defaultProject[TodoList.defaultProject.length - 1]
            );
          } else if (
            choosedAsideEl.classList.contains("aside-due-dates-today")
          ) {
            addTaskToProject(TodoList.defaultProject);

            if (isToday(new Date(TodoList.defaultProject.dueDate))) {
              renderTask(
                TodoList.defaultProject[TodoList.defaultProject.length - 1]
              );
            }
          } else if (
            choosedAsideEl.classList.contains("aside-due-dates-this-week")
          ) {
            addTaskToProject(TodoList.defaultProject);

            if (
              isThisWeek(new Date(TodoList.defaultProject.dueDate), {
                weekStartsOn: 1,
              })
            ) {
              renderTask(
                TodoList.defaultProject[TodoList.defaultProject.length - 1]
              );
            }
          } else if (choosedAsideEl.classList.contains("aside-project")) {
            for (const project of TodoList.projects) {
              if (project.projectId === choosedAsideEl.dataset.id) {
                addTaskToProject(project.projectToDo);
                renderTask(project.projectToDo[project.projectToDo.length - 1]);
              }
            }
          }
        }

        modalFormContainerEl.addEventListener(
          "submit",
          function (e) {
            e.preventDefault();
            e.target.reset();
            clearModal();
          },
          { once: true }
        );
      }

      if (modalFormAddButton.textContent.toLowerCase().trim() === "confirm") {
        if (
          choosedAsideEl.classList.contains("aside-due-dates-inbox") ||
          choosedAsideEl.classList.contains("aside-due-dates-today") ||
          choosedAsideEl.classList.contains("aside-due-dates-this-week")
        ) {
          for (const task of TodoList.defaultProject) {
            confirmEdit(task);
          }
        } else if (choosedAsideEl.classList.contains("aside-project")) {
          for (const project of TodoList.projects) {
            for (const task of project.projectToDo) {
              confirmEdit(task);
            }
          }
        }

        modalFormContainerEl.addEventListener(
          "submit",
          function (e) {
            e.preventDefault();
            e.target.reset();
            clearModal();
          },
          { once: true }
        );
      }
    });

    modalEl.addEventListener("click", function (e) {
      if (
        e.target === this ||
        e.target.classList.contains("modal-titlebar-logo") ||
        e.target.closest(".modal-titlebar-logo")
      ) {
        if (!modalFormContainerEl.classList.contains("hide")) {
          modalFormContainerEl.reset();
        }

        clearModal();
      }
    });
  },
  { once: true }
);
