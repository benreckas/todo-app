// Queries
const userInput = document.querySelector('.list-input'); // To-Do Text Input
const userEdit = document.querySelector('.list-edit'); // Edit Text Input
const editModal = document.querySelector('.edit-modal'); // Edit Text Modal
const confirmModal = document.querySelector('.confirm-modal'); // Confirm Del Modal
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
  this.strike = () => {
    this.li.classList.add('strikethrough');
    this.checked.classList.remove('hidden');
    this.checkbox.classList.add('hidden');
    this.editIcon.classList.add('hidden');
  };
};

// Remove item from a given array
const removeFromArr = (arr, eval) => {
  for(let i = 0; i <= arr.length; i++) {
    if(arr[i] === eval) {
      arr.splice(i, 1)
    }
  };
};

// Add user input to todo list
const userSubmit = () => {
  forms.addToDo.submit.addEventListener('click', (e) => {
    e.preventDefault();
    const inputText = userInput.value;
    if(inputText.length > 1) {
      todoArr.push(inputText);
      const str = inputText;
      const createNewTask = new Todo(str);
      todoList.append(createNewTask.li);
      userInput.value = "";
    };
  });
};

// Check the box and run the function to move the li to the completed ul
const checkTask = (targetLi) => {
    removeFromArr(todoArr, targetLi.textContent);
    todoList.removeChild(targetLi);
    completedArr.push(targetLi.textContent);
    const str = targetLi.textContent;
    const completedTask = new Todo(str);
    completedTask.strike();
    completedList.append(completedTask.li);
};

// Uncheck the box and re-insert the li back to the to-do ul
const uncheckTask = (targetLi) => {
  completedList.removeChild(targetLi);
  removeFromArr(completedArr, targetLi.textContent);
  todoArr.unshift(targetLi.textContent);
  const str = targetLi.textContent;
  const editTask = new Todo(str);
  todoList.insertBefore(editTask.li, todoList.firstChild);
};

// Delete a to-do or a completed li, prompt with a confirmation message
const delTask = (targetLi) => {
  confirmModal.classList.remove('hidden');
  forms.confirmDel.del.addEventListener('click', (e) => {
    e.preventDefault();
    if (targetLi.parentNode === todoList) {
      todoList.removeChild(targetLi);
      confirmModal.classList.add('hidden');
      removeFromArr(todoArr, targetLi.textContent);
      return;
    } else if (targetLi.parentNode === completedList) {
      completedList.removeChild(targetLi);
      confirmModal.classList.add('hidden');
      removeFromArr(completedArr, targetLi.textContent);
      return;
    }
  });
  forms.confirmDel.cancel.addEventListener('click', (e) => {
    e.preventDefault();
    confirmModal.classList.add('hidden');
    return;
  });
};

// Edit a li, and reinsert it back to the to-do ul
const editTask = (targetLi) => {
  userEdit.setAttribute('placeholder', targetLi.textContent);
  editModal.classList.remove('hidden');
  forms.editToDo.submit.addEventListener('click', (e) => {
    e.preventDefault();
    if(userEdit.value.length === 0) {
      editModal.classList.add('hidden');
      userEdit.value = '';
      return;
    } else {
      for (let i = 0; i <= todoArr.length; i++) {
        if(todoArr[i] === targetLi.textContent) {
          todoArr.splice(i, 1, userEdit.value)
        }
      };
      const str = userEdit.value;
      const appendedTask = new Todo(str);
      targetLi.parentNode.replaceChild(appendedTask.li, targetLi);
      editModal.classList.add('hidden');
      userEdit.value = '';
      return;
    }
  });
  editModal.addEventListener('click', (e) => {
    if(e.target === editModal) {
      editModal.classList.add('hidden');
      return;
    }
  });
};

// Store the value of the ul's to local storage when page is closed or refreshed.
window.onbeforeunload = () => {
  localStorage.setItem('todoArr', JSON.stringify(todoArr));
  localStorage.setItem('completedArr', JSON.stringify(completedArr));
};

// Event Listeners
const listListeners = (element, evt) => {
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
    };
  });
};

// Load local storage and populate lists on page load
const loadStorage = (arr) => {
  for (let i = 0; i <= arr.length; i++) {
    if (arr[i] !== undefined && arr[i] !== null) {
      const str = arr[i];
      const storedList = new Todo(str);
      if (arr === todoParsed) {
        todoArr.push(arr[i])
        todoList.append(storedList.li)
      } else {
        completedArr.push(arr[i])
        storedList.strike();
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
