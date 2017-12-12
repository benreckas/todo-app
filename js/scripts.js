// Queries
const userInput = document.querySelector('.list-input'); // To-Do Text Input
const userEdit = document.querySelector('.list-edit'); // Edit Text Input
const editModal = document.querySelector('.edit-modal'); // Edit Text Modal
const forms = document.forms; // Input Form
const todoList = document.querySelector('.todo-list'); // To-Do ul
const completedList = document.querySelector('.completed-list'); // Completed ul
const todoArr = []; // To-Do Arr
const completedArr = []; // Completed Arr
// Local Storage
const todoArrStore = localStorage.getItem('todoArr');
const completedArrStore = localStorage.getItem('completedArr');
const todoParsed = JSON.parse(todoArrStore) || [];
const completedParsed = JSON.parse(completedArrStore) || [];

// li Constructor, takes in the li's textContent and adds necessary elements to item
function Todo(str) {
  this.li = document.createElement('li');
  this.li.textContent = str;
  this.checkbox = document.createElement('i');
  this.checked = document.createElement('i');
  this.editIcon = document.createElement('i');
  this.delIcon = document.createElement('i');
  this.li.setAttribute("draggable", true); // Allow li to be Draggable
  this.checkbox.classList.add("fa", "fa-square-o"); // Empty Checkbox Icon
  this.checked.classList.add("fa", "fa-check-square-o", "hidden"); // Checked Box Icon
  this.editIcon.classList.add("fa", "fa-pencil"); // Pencil Icon
  this.delIcon.classList.add("fa", "fa-trash-o"); // Trash Icon
  this.li.append(this.checkbox, this.checked, this.delIcon, this.editIcon);
};

// Remove item from Arr
// const removeFromArr = (arr, targetLi) => {
//   for(let i = 0; i <= arr.length; i++) {
//     console.log(completedArr);
//     if(arr[i] === targetLi.textContent) {
//       arr.splice(i, 1)
//       console.log(completedArr);
//     }
//   }
// };


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

// Add a new to-do item to the to-do ul
const addToDoLi = () => {
  const str = todoArr[todoArr.length - 1];
  const createNewTask = new Todo(str);
  todoList.append(createNewTask.li);
};

// Check the box and move a to-do li to the completed ul
const completedLi = () => {
  const str = completedArr[completedArr.length - 1];
  const completedTask = new Todo(str);
  completedTask.li.classList.add('strikethrough');
  completedTask.checked.classList.remove('hidden');
  completedTask.checkbox.classList.add('hidden');
  completedTask.editIcon.classList.add('hidden');
  completedList.append(completedTask.li);
};

// Insert a previously completed li back to the to-do ul from the completed ul
const insertLi = (targetLi) => {
  const str = targetLi.textContent;
  const editTask = new Todo(str);
  todoList.insertBefore(editTask.li, todoList.firstChild);
};

// Delete a to-do or a completed li, prompt with a confirmation message
const delTask = (targetLi) => {
  const delConf = confirm("This will permenately delete the task.\nAre you sure you want to do this?");
  if(delConf === true && targetLi.parentNode == todoList) {
    todoList.removeChild(targetLi);
    for(let i = 0; i <= todoArr.length; i++) {
      if(todoArr[i] === targetLi.textContent) {
        todoArr.splice(i, 1)
      }
    }
  }
  else if(delConf === true && targetLi.parentNode == completedList) {
    completedList.removeChild(targetLi);
    for(let i = 0; i <= completedArr.length; i++) {
      if(completedArr[i] === targetLi.textContent) {
        completedArr.splice(i, 1)
      }
    }
  }
};

// Check the box and run the function to move the li to the completed ul
const checkTask = (targetLi) => {
    todoList.removeChild(targetLi);
    for(let i = 0; i <= todoArr.length; i++) {
      if(todoArr[i] === targetLi.textContent) {
        todoArr.splice(i, 1)
      }
    }
    completedArr.push(targetLi.textContent);
    completedLi();
};

// Uncheck the box and re-insert the li back to the to-do ul
const uncheckTask = (targetLi) => {
  completedList.removeChild(targetLi);
  for(let i = 0; i <= completedArr.length; i++) {
    if(completedArr[i] === targetLi.textContent) {
      completedArr.splice(i, 1)
    }
  }
  todoArr.unshift(targetLi.textContent);
  insertLi(targetLi);
};

// Edit a li, and reinsert it back to the to-do ul
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
      for(let i = 0; i <= todoArr.length; i++) {
        if(todoArr[i] === targetLi.textContent) {
          todoArr.splice(i, 1, userEdit.value)
        }
      }
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

window.onbeforeunload = function(){
  localStorage.setItem('todoArr', JSON.stringify(todoArr));
  localStorage.setItem('completedArr', JSON.stringify(completedArr));
}

// Event Listeners
const listListeners = function(element, evt) {
  element.addEventListener(evt, (e) => {
    const targetLi = e.target.parentNode;
    switch (e.target.classList[1]) {
      case "fa-trash-o": // Delete Icon
        delTask(targetLi);
        break;
      case "fa-square-o": // Empty Checkbox Icon
        checkTask(targetLi);
        break;
      case "fa-check-square-o": // Checked Box Icon
        uncheckTask(targetLi);
        break;
      case "fa-pencil": // Edit Icon
        editTask(targetLi);
        break;
    }
  });
};

const loadStorage = (arr) => {
  for (let i = 0; i <= arr.length; i++) {
    if (arr[i] !== undefined) {
      const str = arr[i];
      const storedList = new Todo(str);
      if (arr === todoParsed) {
        todoArr.push(arr[i])
        todoList.append(storedList.li)
      } else {
        completedArr.push(arr[i])
        storedList.li.classList.add('strikethrough');
        storedList.checked.classList.remove('hidden');
        storedList.checkbox.classList.add('hidden');
        storedList.editIcon.classList.add('hidden');
        completedList.append(storedList.li);
      }
    }
  }
};

// Call Functions on Page Load
userSubmit();
loadStorage(todoParsed);
loadStorage(completedParsed);
listListeners(document, 'click');



// var todoLiDrag = todoList.querySelectorAll('li');
// var completedLiDrag = todoList.querySelectorAll('li');
//
// const dragListeners = function(element, evt) {
//   element.addEventListener(evt, (e) => {
//     switch (element) {
//       case "fa-trash-o": // Delete Icon
//         delTask(targetLi);
//         break;
//       case "fa-square-o": // Empty Checkbox Icon
//         checkTask(targetLi);
//         break;
//       case "fa-check-square-o": // Checked Box Icon
//         uncheckTask(targetLi);
//         break;
//       case "fa-pencil": // Edit Icon
//         editTask(targetLi);
//         break;
//     }
//   });
// };
// dragListeners(document, 'click');
//
// var dragSrcEl = null;
//
// function handleDragStart(e) {
//   this.style.opacity = '0.4';  // this / e.target is the source node.
//
//   dragSrcEl = this;
//
//   e.dataTransfer.effectAllowed = 'move';
//   e.dataTransfer.setData('text/html', this.innerHTML);
// }
//
// function handleDragOver(e) {
//   if (e.preventDefault) {
//     e.preventDefault(); // Necessary. Allows us to drop.
//   }
//   e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
//   return false;
// };
//
// function handleDragEnter(e) {
//   // this / e.target is the current hover target.
//   this.classList.add('over');
// };
//
// function handleDragLeave(e) {
//   this.classList.remove('over');  // this / e.target is previous target element.
// }
//
// function handleDrop(e) {
//   // this / e.target is current target element.
//
//   if (e.stopPropagation) {
//     e.stopPropagation(); // stops the browser from redirecting.
//   }
//
//   // See the section on the DataTransfer object.
//
//   return false;
// }
//
// function handleDragEnd(e) {
//   // this/e.target is the source node.
//
//   [].forEach.call(todoLiDrag, function (todoLiDrag) {
//     todoLiDrag.classList.remove('over');
//   });
// }
//
// [].forEach.call(todoLiDrag, function(todoLiDrag) {
//   todoLiDrag.addEventListener('dragstart', handleDragStart, false);
//   todoLiDrag.addEventListener('dragenter', handleDragEnter, false);
//   todoLiDrag.addEventListener('dragover', handleDragOver, false);
//   todoLiDrag.addEventListener('dragleave', handleDragLeave, false);
//   todoLiDrag.addEventListener('drop', handleDrop, false);
//   todoLiDrag.addEventListener('dragend', handleDragEnd, false);
// });

// Draggable li
