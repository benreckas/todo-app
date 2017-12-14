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

// Store the value of the todoArr and completedArr to local storage when page is closed or refreshed.
window.onbeforeunload = () => {
  localStorage.setItem('todoArr', JSON.stringify(todoArr));
  localStorage.setItem('completedArr', JSON.stringify(completedArr));
};

// li Constructor, takes in the li's textContent and adds necessary elements to item
function Todo(str) {
  // Create Li and pass it a string for its textContent
  this.li = document.createElement('li');
  this.li.textContent = str;
  // Create 4 font awesome icons
  this.checkbox = document.createElement('i');
  this.checked = document.createElement('i');
  this.editIcon = document.createElement('i');
  this.delIcon = document.createElement('i');
  // Pass those icons the necessary classes
  this.li.setAttribute("draggable", true); // Allow li to be Draggable
  this.checkbox.classList.add("fa", "fa-square-o"); // Empty Checkbox Icon
  this.checked.classList.add("fa", "fa-check-square-o", "hidden"); // Checked Box Icon
  this.editIcon.classList.add("fa", "fa-pencil"); // Pencil Icon
  this.delIcon.classList.add("fa", "fa-trash-o"); // Trash Icon
  // Mobile Friendly Icons
  this.checkbox.setAttribute("onclick", "void(0)");
  this.checked.setAttribute("onclick", "void(0)");
  this.editIcon.setAttribute("onclick", "void(0)");
  this.delIcon.setAttribute("onclick", "void(0)");
  // Append icons to the li
  this.li.append(this.checkbox, this.checked, this.delIcon, this.editIcon);
  // Optional function to check the box and strikethrough the text
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
    if(inputText.length > 0) {
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
  forms.confirmDel.del.addEventListener('click', delBtn);
  forms.confirmDel.cancel.addEventListener('click', cancelBtn);
  document.addEventListener('keypress', delBtn);
  // Continue to delete the task
  function delBtn(e) {
    console.log(e);
    if(e.target === forms.confirmDel.del || e.keyCode === 13) {
      e.preventDefault();
      if (targetLi.parentElement === todoList) {
        todoList.removeChild(targetLi);
        confirmModal.classList.add('hidden');
        removeFromArr(todoArr, targetLi.textContent);
      } else if (targetLi.parentElement === completedList) {
        completedList.removeChild(targetLi);
        confirmModal.classList.add('hidden');
        removeFromArr(completedArr, targetLi.textContent);
      }
      forms.confirmDel.del.removeEventListener('click', delBtn);
      forms.confirmDel.cancel.removeEventListener('click', cancelBtn);
      document.removeEventListener('keypress', delBtn);
    };
  };
  // Cancel the delete process
  function cancelBtn(e) {
      e.preventDefault();
      confirmModal.classList.add('hidden');
      forms.confirmDel.del.removeEventListener('click', delBtn);
      forms.confirmDel.cancel.removeEventListener('click', cancelBtn);
      forms.confirmDel.removeEventListener('keydown', delBtn);
  };
};

// Edit a li, and reinsert it back to the to-do ul
const editTask = (targetLi) => {
  userEdit.setAttribute('placeholder', targetLi.textContent);
  editModal.classList.remove('hidden');
  forms.editToDo.edit.addEventListener('click', editSubmit);
  document.addEventListener('keypress', editSubmit);
  // Take another user input and replace the existing task with a new one
  function editSubmit(e) {
    if(e.target === forms.editToDo.edit || e.keyCode === 13) {
      e.preventDefault();
      if(userEdit.value.length === 0) {
        editModal.classList.add('hidden');
      } else {
        const str = userEdit.value;
        const appendedTask = new Todo(str);
        editModal.classList.add('hidden');
        for (let i = 0; i <= todoArr.length; i++) {
          if(todoArr[i] === targetLi.textContent) {
            todoArr.splice(i, 1, str)
          }
        };
        todoList.replaceChild(appendedTask.li, targetLi);
        userEdit.value = '';
      }
      forms.editToDo.edit.removeEventListener('click', editSubmit);
      document.removeEventListener('keypress', editSubmit);
    };
  };
};

// Icon Event Listeners
const iconListeners = (element, evt) => {
  element.addEventListener(evt, (e) => {
    const targetLi = e.target.parentElement;
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
iconListeners(document, 'click');
