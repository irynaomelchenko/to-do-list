// Форма
// Список задач
const tasks = [];

for (let i =  0; i < localStorage.length; i++) {
  let key = Object.keys(localStorage)[i]
  tasks.push(JSON.parse(localStorage[key]))
};


(function(arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});
    
  const emptyMsg = document.querySelector('.empty-msg');
  const btnContainer = document.querySelector('.btn-container');

  if (arrOfTasks.length == 0) {
    emptyMsg.style.display = 'block';
    btnContainer.style.display = 'none';
  };

  const themes = {
    default: {
      '--base-text-color': '#212529',
      '--header-bg': '#007bff',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#007bff',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#0069d9',
      '--default-btn-border-color': '#0069d9',
      '--danger-btn-bg': '#dc3545',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#bd2130',
      '--danger-btn-border-color': '#dc3545',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#80bdff',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    dark: {
      '--base-text-color': '#212529',
      '--header-bg': '#343a40',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#58616b',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#292d31',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#b52d3a',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#88222c',
      '--danger-btn-border-color': '#88222c',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
    light: {
      '--base-text-color': '#212529',
      '--header-bg': '#fff',
      '--header-text-color': '#212529',
      '--default-btn-bg': '#fff',
      '--default-btn-text-color': '#212529',
      '--default-btn-hover-bg': '#e8e7e7',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#f1b5bb',
      '--danger-btn-text-color': '#212529',
      '--danger-btn-hover-bg': '#ef808a',
      '--danger-btn-border-color': '#e2818a',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
  };
  let lastSelectedTheme = 'default';

  // Elemnts UI
  const listContainer = document.querySelector('.tasks-list-section .list-group');
  const form = document.forms['addTask'];
  const inputTitle = form.elements['title'];
  const inputBody = form.elements['body'];
  const themeSelect = document.getElementById('themeSelect');  
  const allTasksBtn = document.getElementById('all-tasks-btn');
  const incompleteTasksBtn = document.getElementById('incomplete-tasks-btn');

  // Events  
  renderAllTasks(objOfTasks);
  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeleteHandler);
  listContainer.addEventListener('click', onDoneHandler);
  themeSelect.addEventListener('change', onThemeSelectHandler);
  allTasksBtn.addEventListener('click', onAllTasksHandler);
  incompleteTasksBtn.addEventListener('click', onIncompleteTasksHandler);

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error('Передайте список задач!');
      return;
    }

    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach(task => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);
  }

  function listItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center',
      'flex-wrap',
      'mt-2',
    );
    li.setAttribute('data-task-id', _id);
    li.style.transition = 'all 2s'
    if (objOfTasks[_id].completed === true) {
      li.style.backgroundColor = '#e8f0fe';      
    } else li.style.backgroundColor = '#fff';

    const span = document.createElement('span');
    span.textContent = title;
    span.style.fontWeight = 'bold';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete task';
    deleteBtn.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn');

    const article = document.createElement('p');
    article.textContent = body;
    article.classList.add('mt-2', 'w-100');
    
    const doneBtn = document.createElement('button');
    if (objOfTasks[_id].completed === true) {
      doneBtn.textContent = 'Undone!';      
    } else doneBtn.textContent = 'Done!';
    doneBtn.classList.add('btn', 'btn-default', 'ml-auto', 'done-btn');    

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(article);
    li.appendChild(doneBtn);

    return li;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert('Enter title and body please');
      return;
    }

    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement('afterbegin', listItem);
    form.reset();
  }

  function createNewTask(title, body) {
    const newTask = {
      _id: `task-${Math.random()}`,
      completed: false,
      body, 
      title,   
    };

    objOfTasks[newTask._id] = newTask;
    localStorage.setItem(newTask._id, JSON.stringify(newTask));
    console.log(objOfTasks);
    
    if (Object.keys(objOfTasks).length > 0) {
      emptyMsg.style.display = 'none';
      btnContainer.style.display = 'flex';
    };

    return { ...newTask };
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Do you want to delete this task: ${title}?`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
    localStorage.removeItem(id)
    if (Object.keys(objOfTasks).length === 0) {
      emptyMsg.style.display = 'block';
      btnContainer.style.display = 'none';
    };
    return isConfirm;
  }  

  function deleteTaskFromHtml(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains('delete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHtml(confirmed, parent);  
    }
  }

  function markTaskInHtml(el) {
    if (allTasksBtn.classList.contains('active-btn')) {
      if (el.childNodes[3].textContent === 'Undone!')  {
        el.style.backgroundColor = '#fff';
        el.childNodes[3].textContent = 'Done!';
        el.remove();
        listContainer.prepend(el)
      } else if (el.childNodes[3].textContent === 'Done!') {
        el.style.backgroundColor = '#e8f0fe';
        el.childNodes[3].textContent = 'Undone!';  
        el.remove();
        listContainer.append(el)
      }
    } else if (incompleteTasksBtn.classList.contains('active-btn')) {
      el.setAttribute('style', 'display: none!important')
      el.remove();
      listContainer.append(el)
    }
    
  }

  function onDoneHandler({ target }) {
    if (target.classList.contains('done-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      if (objOfTasks[id].completed === false) {
        objOfTasks[id].completed = true;
        localStorage.setItem(id, JSON.stringify(objOfTasks[id]))
      } else {
        objOfTasks[id].completed = false;
        localStorage.setItem(id, JSON.stringify(objOfTasks[id]))
      }      
      markTaskInHtml(parent);    
    }
  }

  function onIncompleteTasksHandler() {    
    incompleteTasksBtn.classList.add('active-btn');
    allTasksBtn.classList.remove('active-btn');

    let numOfAllTasks = Object.entries(objOfTasks).length;
    let arrOfCompleteTasks = Object.entries(objOfTasks).filter((task, index) => {
          if (task[1].completed) {
            return task[1]
          }    
        });
    let numOfCompleteTasks = arrOfCompleteTasks.length
    for (let i = 1; i <= numOfCompleteTasks; i++) {
      let completedTask = document.querySelector(`.tasks-list-section .list-group li:nth-child(${numOfAllTasks-numOfCompleteTasks+i})`)
      completedTask.setAttribute('style', 'display: none!important')
    }
  }  

  function onAllTasksHandler() {
    incompleteTasksBtn.classList.remove('active-btn');
    allTasksBtn.classList.add('active-btn')

    let numOfAllTasks = Object.entries(objOfTasks).length;
    let arrOfCompleteTasks = Object.entries(objOfTasks).filter((task, index) => {
          if (task[1].completed) {
            return task[1]
          }    
        });
    let numOfCompleteTasks = arrOfCompleteTasks.length
    for (let i = 1; i <= numOfCompleteTasks; i++) {
      let completedTask = document.querySelector(`.tasks-list-section .list-group li:nth-child(${numOfAllTasks-numOfCompleteTasks+i})`)
      completedTask.setAttribute('style', 'display: flex!important')
      completedTask.style.backgroundColor = '#e8f0fe';
      completedTask.childNodes[3].textContent = 'Undone!'
    }
  }

  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value;
    const isComfirmed = confirm(`Do you want to set ${selectedTheme} theme?`);
    if (!isComfirmed) {
      themeSelect.value = lastSelectedTheme;
      return;
    } 
    setTheme(selectedTheme);
    lastSelectedTheme = themeSelect.value;
  }

  function setTheme(name) {
    const selectedThemeObj = themes[name];
    Object.entries(selectedThemeObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    })
  }

})(tasks);
