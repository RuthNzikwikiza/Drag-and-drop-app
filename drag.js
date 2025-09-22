function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();

    if (taskText === "") return;

    let task = document.createElement("div");
    task.className = "task";
    task.draggable = true;
    task.ondragstart = drag;

    let taskContent = document.createElement("span");
    taskContent.innerText = taskText;
    taskContent.className = "task-content";

    let moveSelect = document.createElement("select");
    moveSelect.className = "task-select";
    moveSelect.innerHTML = `
        <option value="todo">To Do</option>
        <option value="inProgress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
    `;
    moveSelect.onchange = function () {
        document.getElementById(this.value).appendChild(task);
        updateSelectBackgroundColor(this, this.value);
        saveTasks();
    };

    updateSelectBackgroundColor(moveSelect, "todo");

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function () {
        task.remove();
        saveTasks();
    };

    const taskOptions = document.createElement("div");
    taskOptions.className = "task-options";
    taskOptions.appendChild(moveSelect);
    taskOptions.appendChild(deleteBtn);

    task.appendChild(taskContent);
    task.appendChild(taskOptions);

    document.getElementById("todo").appendChild(task);
    taskInput.value = "";

    saveTasks();
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.classList.add("dragging");
}

function drop(event) {
    event.preventDefault();
    let draggedTask = document.querySelector(".dragging");
    if (draggedTask) {
        event.target.appendChild(draggedTask);
        draggedTask.classList.remove("dragging");
        saveTasks();
    }
}

function saveTasks() {
    const tasks = document.querySelectorAll(".task");
    const taskData = [];

    tasks.forEach((task) => {
        const taskContent = task.querySelector(".task-content").innerText;
        const taskStatus = task.closest(".task-column").id;
        taskData.push({ content: taskContent, status: taskStatus });
    });

    localStorage.setItem("tasks", JSON.stringify(taskData));
}

function loadTasks() {
    const taskData = JSON.parse(localStorage.getItem("tasks"));

    if (taskData) {
        taskData.forEach((task) => {
            const taskElement = document.createElement("div");
            taskElement.className = "task";
            taskElement.draggable = true;
            taskElement.ondragstart = drag;

            const taskContent = document.createElement("span");
            taskContent.innerText = task.content;
            taskContent.className = "task-content";

            const moveSelect = document.createElement("select");
            moveSelect.className = "task-select";
            moveSelect.innerHTML = `
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
            `;
            moveSelect.value = task.status;
            moveSelect.onchange = function () {
                document.getElementById(this.value).appendChild(taskElement);
                updateSelectBackgroundColor(this, this.value);
                saveTasks();
            };

            updateSelectBackgroundColor(moveSelect, task.status);

            let deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.innerText = "Delete";
            deleteBtn.onclick = function () {
                taskElement.remove();
                saveTasks();
            };

            const taskOptions = document.createElement("div");
            taskOptions.className = "task-options";
            taskOptions.appendChild(moveSelect);
            taskOptions.appendChild(deleteBtn);

            taskElement.appendChild(taskContent);
            taskElement.appendChild(taskOptions);

            document.getElementById(task.status).appendChild(taskElement);
        });
    }
}

function updateSelectBackgroundColor(selectElement, value) {
    switch (value) {
        case "todo":
            selectElement.style.backgroundColor = "#b1cee7";
            break;
        case "inProgress":
            selectElement.style.backgroundColor = "#ecc07e";
            break;
        case "review":
            selectElement.style.backgroundColor = "#f3f16c";
            break;
        case "done":
            selectElement.style.backgroundColor = "#3dec66";
            break;
    }
}

window.onload = loadTasks;

document.getElementById("taskInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.keyCode === 13) { 
        event.preventDefault(); 
        addTask(); 
    }
});
