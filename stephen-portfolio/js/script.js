document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  // Academic planner
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const taskCount = document.getElementById("taskCount");
  let tasks = [];

  try {
    tasks = JSON.parse(localStorage.getItem("stephenAcademicTasks")) || [];
  } catch (error) {
    tasks = [];
  }

  function saveTasks() {
    localStorage.setItem("stephenAcademicTasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    if (!taskList) return;
    taskList.replaceChildren();

    tasks.forEach(function (task) {
      const item = document.createElement("li");
      item.className = "task-item" + (task.completed ? " done" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", "Mark task completed");
      checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const taskText = document.createElement("span");
      taskText.textContent = task.text;

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-btn";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        tasks = tasks.filter(function (current) {
          return current.id !== task.id;
        });
        saveTasks();
        renderTasks();
      });

      item.append(checkbox, taskText, deleteButton);
      taskList.appendChild(item);
    });

    const remaining = tasks.filter(function (task) {
      return !task.completed;
    }).length;

    if (taskCount) {
      taskCount.textContent = tasks.length + " task(s) total; " + remaining + " remaining.";
    }
  }

  if (taskForm) {
    taskForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const text = taskInput.value.trim();

      if (!text) {
        alert("Please enter a task.");
        return;
      }

      tasks.push({
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        text: text,
        completed: false
      });

      saveTasks();
      renderTasks();
      taskForm.reset();
      taskInput.focus();
    });

    renderTasks();
  }

  // Contact form validation
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^\d+$/;

      if (!name || !email || !phone || !message) {
        formFeedback.textContent = "Please complete every field.";
        formFeedback.style.color = "#b91c1c";
      } else if (!emailPattern.test(email)) {
        formFeedback.textContent = "Please enter a valid email address.";
        formFeedback.style.color = "#b91c1c";
      } else if (!phonePattern.test(phone)) {
        formFeedback.textContent = "Enter phone digits only, without spaces or the plus sign.";
        formFeedback.style.color = "#b91c1c";
      } else {
        formFeedback.textContent = "All fields are valid! This practice form does not send messages.";
        formFeedback.style.color = "#15803d";
      }
    });
  }
});
