let addBtn = document.querySelector("#add-task-btn");
let taskInput = document.querySelector("#task-input");
let emptyState = document.querySelector("#empty-state");
let taskList = document.querySelector("#task-list");
let total = document.querySelector("#total-count");
let pending = document.querySelector("#pending-count");
let completed = document.querySelector("#completed-count");
let filterBtns = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
function applyFilter(currentFilter){

for(let i=0; i<taskList.children.length; i++){

let currentTask = taskList.children[i];

let currentCheckedBox = currentTask.querySelector("input");

if(currentFilter === "all"){
 currentTask.style.display="";
}

if(currentFilter === "pending"){
if(currentCheckedBox.checked === false){
    currentTask.style.display="";
}
else{
   currentTask.style.display="none";
}
}

if(currentFilter === "completed"){
if(currentCheckedBox.checked === true){
   currentTask.style.display="";
}
else{
   currentTask.style.display="none";
}
}

}
}

function saveTasks(){
   let tasks = [];
   for(let i=0; i<taskList.children.length; i++){
      let currentTasks = taskList.children[i];
      let currentCheckBox = currentTasks.querySelector("input");
      let currentTaskText = currentTasks.querySelector(".task-text");
      let obj = {
         current:currentTaskText.textContent,
         completed:currentCheckBox.checked,
      }
      tasks.push(obj);
      console.log(tasks);

   }
   localStorage.setItem("allTasks", JSON.stringify(tasks));
}

function filterButtons(){

filterBtns.forEach((btn)=>{

btn.addEventListener("click", function(){

let filterType = btn.dataset.filter;

currentFilter = filterType;

filterBtns.forEach((btn)=>{
   btn.classList.remove("active");
});
btn.classList.add("active");

applyFilter(filterType);

});

});

}

filterButtons();

function updateEmptyState(){
//avaScript mein kisi element ke andar kitne child elements hain, ye check karne ke liye .children.length use kar sakte hain.
 if(taskList.children.length === 0){
 emptyState.style.display = "block";
 }
 else{
 emptyState.style.display = "none";
 }
}

function updateCounts(){
 let totalCount = taskList.children.length;
 total.textContent=totalCount;

 let completeCount = 0;
 let pendingCount = 0;

 for(let i=0; i<totalCount; i++){
   let currentTask = taskList.children[i];
   let currentCheckBox = currentTask.querySelector("input");

  if(currentCheckBox.checked===true){
  completeCount++;
  }
  else{
  pendingCount++;
  }
 }

   completed.textContent = completeCount;
   pending.textContent = pendingCount;

}

function createTask(task){

let li = document.createElement("li");
li.classList.add("task-item");

let checkBox= document.createElement("input");
checkBox.type = "checkbox";
checkBox.classList.add("task-checkbox");

let span = document.createElement("span");
span.classList.add("task-text");

if(typeof task === "string"){
 span.textContent = task;
 checkBox.checked = false;
}
else{
   span.textContent = task.current;
   checkBox.checked = task.completed;
   if(task.completed){
      li.classList.add("completed");
   }
}

 let removeBtn = document.createElement("button");
 removeBtn.classList.add("delete-btn");
 removeBtn.textContent="X";

 let editBtn = document.createElement("button");
 editBtn.classList.add("edit-btn");
 editBtn.textContent="Edit";

 taskList.appendChild(li);
 li.appendChild(checkBox);
 li.appendChild(span);
 li.appendChild(removeBtn);
 li.appendChild(editBtn);
  saveTasks();


 removeBtn.addEventListener("click", function(){
    taskList.removeChild(li);
    updateEmptyState();
    updateCounts();
    saveTasks();
 });


   editBtn.addEventListener("click", function(){

      let taskText = li.querySelector("span");

      let oldText = taskText.textContent;
      let inp = document.createElement("input");
      inp.type = "text";
      inp.value = oldText;
      inp.classList.add("edit-input");

      li.replaceChild(inp, taskText);

      let saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.classList.add("save-btn");
      li.appendChild(saveBtn);

      let deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Cancel";
      deleteBtn.classList.add("cancel-btn");
      li.appendChild(deleteBtn);

      editBtn.style.display="none";
      removeBtn.style.display="none";

      saveBtn.addEventListener("click", function(){
      if 
      (inp.value.trim() === "") 
      {
       return;
      }
 
      else
      {
       taskText.textContent = inp.value;
       li.replaceChild(taskText, inp);

       editBtn.style.display="initial";
       removeBtn.style.display="initial";

       saveBtn.style.display="none";
       deleteBtn.style.display="none";

       console.log(li);
       saveTasks();

       }

      });

      deleteBtn.addEventListener("click", function(){

      taskText.textContent = oldText;
      li.replaceChild(taskText, inp);

      editBtn.style.display="initial";
      removeBtn.style.display="initial";

      saveBtn.style.display="none";
      deleteBtn.style.display="none";
      
      });

   });

 checkBox.addEventListener("change", function(){
 li.classList.toggle("completed");
 updateCounts();
 applyFilter(currentFilter);
 updateEmptyState();
 saveTasks();  
 });
}

let savedTasks = localStorage.getItem("allTasks");
if(savedTasks){
   let tasks = JSON.parse(savedTasks);
   console.log(tasks);
   tasks.forEach((task)=>{
     
      createTask(task);

   });

   updateEmptyState();
   updateCounts();

}

addBtn.addEventListener("click", function(){
 let task = taskInput.value.trim();

 if(task===""){
 return;
 }
 else{
  createTask(task);
 }

 updateEmptyState();
 updateCounts();
 taskInput.value="";

});