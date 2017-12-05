// Queries
const userInput = document.querySelector('.list-input');
const userEdit = document.querySelector('.list-edit');
const modal = document.querySelector('.modal');
const forms = document.forms;
const todoList = document.querySelector('.todo-list');
const completedList = document.querySelector('.completed-list');
const todoArr = [];
const completedArr = [];

// todo item constructor function
function Todo(li, check, uncheck, del, edit) {
  this.li = li;
  this.check = check;
  this.uncheck = uncheck;
  this.del = del;
  this.edit = edit;
};


const userSubmit = () => {
  forms.addToDo.submit.addEventListener('click', (e) => {
    e.preventDefault();
    const inputText = userInput.value;
    if(inputText.length > 1) {
      todoArr.push(inputText);
      addLi();
      userInput.value = "";
    }
  });
};
userSubmit();

const addLi = function() {
  const li = document.createElement('li');
  const delIcon = document.createElement('i');
  const editIcon = document.createElement('i');
  const checkbox = document.createElement('i');
  delIcon.classList.add("fa", "fa-pencil");
  editIcon.classList.add("fa", "fa-trash-o");
  checkbox.classList.add("fa", "fa-square-o");
  li.textContent = todoArr[todoArr.length - 1];
  todoList.append(li);
  li.append(checkbox, editIcon, delIcon);
};

const completedLi = function() {
  const li = document.createElement('li');
  const delIcon = document.createElement('i');
  const editIcon = document.createElement('i');
  const checkbox = document.createElement('i');
  li.classList.add("strikethrough");
  delIcon.classList.add("fa", "fa-pencil", 'hidden');
  editIcon.classList.add("fa", "fa-trash-o");
  checkbox.classList.add("fa", "fa-check-square-o");
  li.textContent = completedArr[completedArr.length - 1];
  completedList.append(li);
  li.append(checkbox, editIcon, delIcon);
};

const insertLi = function() {
  const li = document.createElement('li');
  const delIcon = document.createElement('i');
  const editIcon = document.createElement('i');
  const checkbox = document.createElement('i');
  delIcon.classList.add("fa", "fa-pencil");
  editIcon.classList.add("fa", "fa-trash-o");
  checkbox.classList.add("fa", "fa-square-o");
  li.textContent = todoArr[todoArr.length - 1];
  todoList.insertBefore(li, todoList.firstChild);
  li.append(checkbox, editIcon, delIcon);
};

const eListen = function() {
  document.addEventListener('click', (e) => {
    const eTarget = e.target;
    switch (eTarget.classList[1]) {
      case "fa-trash-o":
        delTask(eTarget);
        break;
      case "fa-square-o":
        checkTask(eTarget);
        break;
      case "fa-check-square-o":
        uncheckTask(eTarget);
        break;
      case "fa-pencil":
        editTask(eTarget);
        break;
    }
  });
};

eListen();

const delTask = function (eTarget) {
  const delConf = confirm("This will permenately delete the task.\nAre you sure you want to do this?");
  if(delConf === true && eTarget.parentNode.parentNode == todoList) {
    todoList.removeChild(eTarget.parentNode);
  }
  else if(delConf === true && eTarget.parentNode.parentNode == completedList) {
    completedList.removeChild(eTarget.parentNode);
  }
};

const checkTask = function(eTarget) {
    todoList.removeChild(eTarget.parentNode);
    for(let i = 0; i <= todoArr.length; i++) {
      if(todoArr[i] === eTarget.parentNode.textContent) {
        todoArr.splice(i, 1)
      }
    }
    completedArr.push(eTarget.parentNode.textContent);
    completedLi();
};

const uncheckTask = function(eTarget) {
  completedList.removeChild(eTarget.parentNode);
  for(let i = 0; i <= completedArr.length; i++) {
    if(completedArr[i] === eTarget.parentNode.textContent) {
      completedArr.splice(i, 1)
    }
  }
  todoArr.push(eTarget.parentNode.textContent);
  insertLi();
};

const editTask = function(eTarget) {
  userEdit.setAttribute('placeholder', eTarget.parentNode.textContent);
  modal.classList.remove('hidden');
  forms.editToDo.submit.addEventListener('click', (e) => {
    e.preventDefault();
    if(userEdit.value.length === 0) {
      eTarget.parentNode.innerHTML = eTarget.parentNode.innerHTML;
      modal.classList.add('hidden');
      userEdit.value = '';
    } else {
      eTarget.parentNode.innerHTML = `${userEdit.value} <i class="fa fa-square-o"></i><i class="fa fa-trash-o"></i><i class="fa fa-pencil"></i>`;
      modal.classList.add('hidden');
      userEdit.value = '';
    }
  });
  document.addEventListener('click', (e) => {
    if(e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}
