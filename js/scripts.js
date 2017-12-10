// Queries
const userInput = document.querySelector('.list-input'); // To-Do Text Input
const userEdit = document.querySelector('.list-edit'); // Edit Text Input
const editModal = document.querySelector('.edit-modal'); // Edit Text Modal
const forms = document.forms; // Input Form
const todoList = document.querySelector('.todo-list'); // To-Do ul
const completedList = document.querySelector('.completed-list'); // Completed ul
const todoArr = []; // To-Do Arr
const completedArr = []; // Completed Arr

// li Constructor, takes in the li's textContent and adds necessary elements to item
function Todo(str) {
  this.li = document.createElement('li');
  this.li.textContent = str;
  this.checkbox = document.createElement('i');
  this.checked = document.createElement('i');
  this.editIcon = document.createElement('i');
  this.delIcon = document.createElement('i');
  this.checkbox.classList.add("fa", "fa-square-o"); // Empty Checkbox Icon
  this.checked.classList.add("fa", "fa-check-square-o", "hidden"); // Checked Box Icon
  this.editIcon.classList.add("fa", "fa-pencil"); // Pencil Icon
  this.delIcon.classList.add("fa", "fa-trash-o"); // Trash Icon
  this.li.append(this.checkbox, this.checked, this.delIcon, this.editIcon);
};

// Listen for user submission on form input, push it's value to todoArr,
// run the addLi function, and set the input field to empty
const userSubmit = function() {
  forms.addToDo.submit.addEventListener('click', (e) => {
    e.preventDefault();
    const inputText = userInput.value;
    if(inputText.length > 1) {
      todoArr.push(inputText);
      addToDoLi();
      userInput.value = "";
    }
  });
};

userSubmit();

const addToDoLi = () => {
  const str = todoArr[todoArr.length - 1];
  const createNewTask = new Todo(str);
  todoList.append(createNewTask.li);
};

const completedLi = () => {
  const str = completedArr[completedArr.length - 1];
  const completedTask = new Todo(str);
  completedTask.li.classList.add('strikethrough');
  completedTask.checked.classList.remove('hidden');
  completedTask.checkbox.classList.add('hidden');
  completedList.append(completedTask.li);
};

const insertLi = (targetLi) => {
  const str = targetLi.textContent;
  const editTask = new Todo(str);
  todoList.insertBefore(editTask.li, todoList.firstChild);
};

const delTask = function (targetLi) {
  const delConf = confirm("This will permenately delete the task.\nAre you sure you want to do this?");
  if(delConf === true && targetLi.parentNode == todoList) {
    todoList.removeChild(targetLi);
  }
  else if(delConf === true && targetLi.parentNode == completedList) {
    completedList.removeChild(targetLi);
  }
};

const checkTask = function(targetLi) {
    todoList.removeChild(targetLi);
    for(let i = 0; i <= todoArr.length; i++) {
      if(todoArr[i] === targetLi.textContent) {
        todoArr.splice(i, 1)
      }
    }
    completedArr.push(targetLi.textContent);
    completedLi();
};

const uncheckTask = function(targetLi) {
  completedList.removeChild(targetLi);
  for(let i = 0; i <= completedArr.length; i++) {
    if(completedArr[i] === targetLi.textContent) {
      completedArr.splice(i, 1)
    }
  }
  todoArr.push(targetLi.textContent);
  insertLi(targetLi);
};

const editTask = function(targetLi) {
  userEdit.setAttribute('placeholder', targetLi.textContent);
  editModal.classList.remove('hidden');
  forms.editToDo.submit.addEventListener('click', (e) => {
    e.preventDefault();
    if(userEdit.value.length === 0) {
      targetLi.innerHTML = targetLi.innerHTML;
      editModal.classList.add('hidden');
      userEdit.value = '';
    } else {
      targetLi.innerHTML = `${userEdit.value} <i class="fa fa-square-o"></i><i class="fa fa-trash-o"></i><i class="fa fa-pencil"></i>`;
      editModal.classList.add('hidden');
      userEdit.value = '';
    }
  });
  document.addEventListener('click', (e) => {
    if(e.target === editModal) {
      editModal.classList.add('hidden');
    }
  });
};

// Change this to take in an event and and element
const eventListeners = function(element, evt) {
  element.addEventListener(evt, (e) => {
    const targetLi = e.target.parentNode;
    switch (e.target.classList[1]) {
      case "fa-trash-o": // Delete Icon
        delTask(targetLi);
        break;
      case "fa-square-o": // Empty Checkbox Icon
        checkTask(targetLi);
        break;
      case "fa-check-square-o": // Checkbox Icon
        uncheckTask(targetLi);
        break;
      case "fa-pencil": // Edit Icon
        editTask(targetLi);
        break;
    }
  });
};

eventListeners(document, 'click');
