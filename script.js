const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const progressFill = document.getElementById('progress-fill');
const pointsDisplay = document.getElementById('points');
const streakDisplay = document.getElementById('streak');
const totalTasksDisplay = document.getElementById('total-tasks');
const pendingTasksDisplay = document.getElementById('pending-tasks');
const prioritySelect = document.getElementById('priority-select');
const deadlineInput = document.getElementById('deadline-input');
const recurringSelect = document.getElementById('recurring-select');
const searchInput = document.getElementById('search-task');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let points = parseInt(localStorage.getItem('points')) || 0;
let streak = parseInt(localStorage.getItem('streak')) || 0;

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('points', points);
    localStorage.setItem('streak', streak);
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.priority;
        li.innerHTML = `<span>${task.text}${task.deadline ? ` (Due: ${task.deadline})` : ''}</span>`;
        if(task.subtasks) task.subtasks.forEach(sub => li.innerHTML += `<span style="font-size:12px">- ${sub}</span>`);
        const actionsDiv = document.createElement('div');
        actionsDiv.className='task-actions';

        const completeBtn = document.createElement('button');
        completeBtn.textContent='Complete'; completeBtn.className='complete-btn';
        completeBtn.onclick = () => { points+=10; streak++; tasks.splice(index,1); saveTasks(); renderTasks(); };

        const editBtn = document.createElement('button');
        editBtn.textContent='Edit'; editBtn.className='edit-btn';
        editBtn.onclick = ()=>{ const newText=prompt('Edit Task:',task.text); if(newText){ task.text=newText; saveTasks(); renderTasks(); }};

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent='Delete'; deleteBtn.className='delete-btn';
        deleteBtn.onclick = ()=>{ tasks.splice(index,1); saveTasks(); renderTasks(); };

        const addSubBtn = document.createElement('button');
        addSubBtn.textContent='Add Subtask'; addSubBtn.className='add-subtask-btn';
        addSubBtn.onclick = ()=>{ const sub=prompt('Enter Subtask:'); if(sub){ if(!task.subtasks) task.subtasks=[]; task.subtasks.push(sub); saveTasks(); renderTasks(); }};

        actionsDiv.append(completeBtn, editBtn, deleteBtn, addSubBtn);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);
    });
    updateProgress(); updateSummary();
}

function updateProgress(){
    const total=tasks.length+points/10;
    progressFill.style.width=total===0?'0%':`${Math.min(100,(points/total/10*100).toFixed(0))}%`;
    pointsDisplay.textContent=points; streakDisplay.textContent=streak;
}

function updateSummary(){ totalTasksDisplay.textContent=tasks.length; pendingTasksDisplay.textContent=tasks.length; }

addTaskBtn.addEventListener('click',(e)=>{ e.preventDefault(); const text=taskInput.value.trim(); if(text){ tasks.push({text, priority:prioritySelect.value, deadline:deadlineInput.value, recurring:recurringSelect.value, subtasks:[]}); taskInput.value=''; deadlineInput.value=''; saveTasks(); renderTasks(); }});

taskInput.addEventListener('keypress', e=>{ if(e.key==='Enter'){ e.preventDefault(); addTaskBtn.click(); }});

renderTasks();
