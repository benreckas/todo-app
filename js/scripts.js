const userInput = document.querySelector('input');
const todoList = document.querySelector('ul');
// const delete = document.createElement('li');
// const edit = document.createElement('li');
let todoArr = [];

const addItem = function (userInput) {
  document.addEventListener('keydown', ((e) => {
    const inputText = userInput.value;
    if (e.keyCode == 13) {
      todoArr.push([inputText]);
      for (let i = 0; i <= todoArr.length; i++) {
        const listItem = document.createElement('li');
        listItem.innerHTML = todoArr[i];
        if (todoArr[i] != undefined) {
        todoList.appendChild(listItem);
        console.log(todoArr);
        }
      }
      userInput.value = '';
    }
  }));
};

addItem(userInput);
