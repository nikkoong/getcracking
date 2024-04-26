let tasks = [];

// Check if there are tasks in local storage
const storedTasks = localStorage.getItem('tasks');
if (storedTasks) 
{
    tasks = JSON.parse(storedTasks);
    renderTasks();
}

function addTask() 
{
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText !== '')
    {
        tasks.unshift(
            {
                text: taskText,
                completed:false
            }
        );
        taskInput.value = '';
        renderTasks();
        saveTasks();
    }
}

// add event listener for "enter" key press to taskInput
document.getElementById('taskInput').addEventListener('keyup', function(event){
    if (event.key === 'Enter') {
        addTask();
    }
});

function toggleTask(index) 
{
    const task = tasks[index];
    task.completed = !task.completed;
    // if we mark done, then move to bottom (push)
    if (task.completed) {
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
        tasks.push(task);
           
    } else {
        // if we mark reactivated, the move to top (unshift)
        const index = tasks.indexOf(task);
        tasks.splice(index,1);
        tasks.unshift(task);
    }

    renderTasks();
    saveTasks();
}

function duplicateTask(index) {
    const task = tasks[index];
    const dupeTask = {...task};
    tasks.splice(index, 0, dupeTask);
    renderTasks();
    saveTasks();
}

function deleteTask(index)
{
    tasks.splice(index,1);
    renderTasks();
    saveTasks();
}

function addNote(index) {
    const task = tasks[index];
    const noteInput = prompt("Enter a note: ", task.note);
    if (noteInput !== null) {
        task.note = noteInput;
        renderTasks();
        saveTasks();
    }
}

function updateTaskText(index) {
    const task = tasks[index];
    const newTaskText = prompt("Edit task: ",task.text);
    if (newTaskText !== null) {
        task.text = newTaskText;
        renderTasks();
        saveTasks();
    }
}

function renderTasks()
{
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach( (task,index) => {
        const li= document.createElement('li');
        li.innerHTML = `
        <span class="${task.completed ? 'completed' : ''}" onclick="toggleTask(${index})">${task.text}</span>
        
        <button class="editbutton" onclick="updateTaskText(${index})" >
            <i class="fa-solid fa-pen"></i>
        </button>

        <button class="notebutton" onclick="addNote(${index})" >
            <i class="fa-solid fa-comment"></i>
        </button>

        <button class="duplicatebutton" onclick="duplicateTask(${index})" >
            <i class="fa-solid fa-copy"></i>
        </button>

        <button class="deletebutton" onclick="deleteTask(${index})" >
            <i class="fa-solid fa-trash"></i>
        </button>

        `; 
        //Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip-content');
        if (!task.completed) {
            tooltip.innerHTML = "Mark done"
        } else {
            tooltip.innerHTML = "Mark undone"
        }
        //Position absolutely relative to task item
        li.appendChild(tooltip);

        //create note element
        if (task.note) {
            const note = document.createElement('div');
            note.classList.add('note');
            note.innerHTML = task.note;
            li.appendChild(note);
        }



        taskList.appendChild(li);
    });
}

function saveTasks()
{
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById('modeToggle').addEventListener('click',() => {
    const body = document.body;
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator)
{
    navigator.serviceWorker.register('/service-worker.js')
        .then(reg => {
            console.log('Service Worker registered');
        })
        .catch(error => {
            console.error('Service Worker registration failed: "', error);
        });
}