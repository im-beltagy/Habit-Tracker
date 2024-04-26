// ==> Tasks
let main = document.querySelector("main"),
  tasks = new Array(),
  checkedTasks = new Array();
// ==> New Task
document.getElementById("new-task").addEventListener("click", createTask);

function createTask() {
  // Remove no-tasks Paragraph
  if (tasks.length === 0) {
    main.innerHTML = "";
  }
  // Create The DOM
  let task = document.createElement("div");
  task.className = "task";
  let checkbox = document.createElement("span");
  checkbox.className = "checkbox";
  let taskTitle = document.createElement("h3");
  taskTitle.className = "task-title";
  taskTitle.innerText = "Task Name";
  let btns = document.createElement("div");
  btns.className = "btns";
  let delBtn = document.createElement("button");
  delBtn.className = "delete";
  delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  let editBtn = document.createElement("button");
  editBtn.className = "edit";
  editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
  btns.append(delBtn, editBtn);
  let details = document.createElement("p");
  details.className = "details";
  details.innerText = "Type Details.";

  task.append(checkbox, taskTitle, btns, details);
  // Adding The Task To Main And Tasks Array
  main.append(task);
  taksEvents(task);
  tasks.push(task);
  saveTasks();
}

// ==> Applying Events On Tasks
function taksEvents(task) {
  let btns = task.lastElementChild.previousElementSibling;
  // edit btn
  let details = task.querySelector(".details"),
    taskTitle = task.querySelector(".task-title");
  task.querySelector(".btns .edit").onclick = function () {
    if (task.classList.contains("editable")) {
      details.contentEditable = "false";
      taskTitle.contentEditable = "false";
      saveTasks();
    } else {
      details.contentEditable = "true";
      taskTitle.contentEditable = "true";
    }
    task.classList.toggle("editable");
    this.classList.toggle("active");
  };
  // delete btn
  task.querySelector(".btns .delete").onclick = function () {
    task.remove();
    delete task;
    tasks = tasks.filter((value) => {
      // remove from Array
      if (value !== task) {
        return value;
      }
    });
    checkedTasks = checkedTasks.filter((value) => {
      if (value !== task) {
        return value;
      }
    });
    if (tasks.length === 0) {
      main.innerHTML =
        '<p id="no-tasks" class="no-tasks">Click (+) Button To Create A New Task!</p>';
    }
    saveTasks();
  };
  // check box btn
  task.querySelector(".checkbox").onclick = function () {
    if (task.classList.contains("checked")) {
      checkedTasks = checkedTasks.filter((value) => {
        if (value !== task) {
          return value;
        }
      });
    } else {
      checkedTasks.push(task);
    }
    task.classList.toggle("checked");
    saveTasks();
  };
}

// ==> Get Day To Be Done
const habitTracker = document.getElementById("habit-tracker");
let done = false;
let lastCheckedDay = localStorage.getItem("lastCheckedDay"),
  beforeLastCheckedDay = localStorage.getItem("beforeLastCheckedDay"),
  today = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
document.getElementById("day-done").onclick = function () {
  daysInRow = parseInt(localStorage.getItem("daysInRow")) || 0;
  if (done) {
    done = false;
    localStorage.setItem("daysInRow", `${daysInRow - 1}`);
    this.classList.remove("done");
    // Set Last Day Checked
    localStorage.setItem("lastCheckedDay", beforeLastCheckedDay);
  } else {
    done = true;
    localStorage.setItem("daysInRow", `${daysInRow + 1}`);
    this.classList.add("done");
    // Set Last Day Checked
    localStorage.setItem("beforeLastCheckedDay", lastCheckedDay);
    localStorage.setItem("lastCheckedDay", today);
  }
};

// ==> Get The Current And Pervious Days
let lastCheckedDays = parseInt(localStorage.getItem("daysInRow")) || 0;
if (lastCheckedDay === today) {
  // today is done
  lastCheckedDays--;
  done = true;
  document.getElementById("day-done").classList.add("done");
} else if (
  lastCheckedDay ===
  `${new Date().getFullYear()}-${new Date().getMonth()}-${
    new Date().getDate() - 1
  }`
) {
  // yesterday is checked
} else if (lastCheckedDay === beforeLastCheckedDay || lastCheckedDay == null) {
  // yesterday or before you checked for done and cancelled
  localStorage.setItem("daysInRow", null);
  lastCheckedDays = 0;
} else {
  // last checked day is far
  localStorage.setItem("daysInRow", null);
  lastCheckedDays = 0;
}
for (let i = 0; i <= lastCheckedDays; i++) {
  let currentDay = new Date().getDate() - i;
  if (currentDay <= 0) {
    // Find The Day In The Previous Month
    currentDay =
      new Date(
        `${new Date().getFullYear() + 1} ${new Date().getMonth() + 1} 0`
      ).getDate() + currentDay;
  }
  let span = document.createElement("span");
  span.innerText = currentDay;
  if (i === 0) {
    span.classList.add("current");
  }
  habitTracker.insertAdjacentElement("afterbegin", span);
}

// ==> Save Tasks In Local Storage
function saveTasks() {
  localStorage.setItem("savedTasks", main.innerHTML);
}
// ==> Get Tasks From Local Storage
window.onload = function () {
  let getTasks = localStorage.getItem("savedTasks");
  if (getTasks !== null) {
    main.innerHTML = getTasks;
    tasks = Array.from(main.querySelectorAll(".task"));
    checkedTasks = tasks.filter((task) => {
      if (task.classList.contains("checked")) {
        return task;
      }
    });
    tasks.forEach((task) => {
      taksEvents(task);
    });
  }
};
// ==> Save Title On Input
document.getElementById("list-title").oninput = function () {
  localStorage.setItem("list-title", this.value);
};
window.addEventListener("onload", () => {
  document.getElementById("list-title").value =
    localStorage.getItem("list-title") || "List Title";
});
