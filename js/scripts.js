const userInput = document.querySelector('input');
const forms = document.forms;
const todoList = document.querySelector('ul');
const todoArr = [];

const userSubmit = function() {
  forms.addToDo.submit.addEventListener('click', (e) => {
    e.preventDefault();
    const inputText = userInput.value;
    if(inputText.length > 1) {
      todoArr.push(inputText);
      addLi();
      userInput.value = "";
    }
  })
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
      // case "fa-pencil":
      //   editTask();
      //   break;
    }
  });
};

eListen();

const delTask = function (eTarget) {
  const delConf = confirm("This will permenately delete the task.\nAre you sure you want to do this?");
  if(delConf === true) {
    todoList.removeChild(eTarget.parentNode);
  }
};

const checkTask = function(eTarget) {
  eTarget.classList.remove('fa-square-o');
  eTarget.classList.add('fa-check-square-o');
  eTarget.parentNode.classList.add('strikethrough');
  eTarget.parentNode.lastChild.classList.add('hidden');
    // for(let i = 0; i <= todoArr.length; i++) {
    //   if(todoArr[i] === eTarget.parentNode.textContent) {
    //     todoArr.splice(i, 1)
    //     console.log(todoArr);
    //   }
    //   todoArr.push(eTarget.parentNode.textContent);
    //   console.log(todoArr);
    //   return;
    // }
};

const uncheckTask = function(eTarget) {
  eTarget.classList.add('fa-square-o');
  eTarget.classList.remove('fa-check-square-o');
  eTarget.parentNode.classList.remove('strikethrough');
  eTarget.parentNode.lastChild.classList.remove('hidden');
};

const editTask = function(eTarget) {
  eTarget
}
