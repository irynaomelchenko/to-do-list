// Форма
// Список задач
const tasks = [];

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

  function renderIncompleteTasks(tasksList) {
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
    doneBtn.textContent = 'Done!';
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
      alert('Пожалуйста введите title и body');
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
    
    if (Object.keys(objOfTasks).length > 0) {
      emptyMsg.style.display = 'none';
      btnContainer.style.display = 'flex';
    };

    return { ...newTask };
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Вы действительно хотите удалить задачу: ${title}?`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
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

  function markTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Вы действительно хотите отметить задачу:\n${title}\nвыполненной?`);

    if (!isConfirm) return isConfirm;
    
    return isConfirm;
  }

  function markTaskInHtml(confirmed, el) {
    if (!confirmed) return;
    el.style.backgroundColor = '#bcdcff';
  }

  function onDoneHandler({ target }) {
    if (target.classList.contains('done-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      const confirmed = markTask(id);
      objOfTasks[id].completed = true;
      markTaskInHtml(confirmed, parent);
    }
  }

  function onIncompleteTasksHandler() {    
    Object.entries(objOfTasks).forEach((task, index) => {
      if (task[1].completed) {
        let completedTask = document.querySelector(`.tasks-list-section .list-group li:nth-child(${Object.entries(objOfTasks).length-index})`)
        completedTask.setAttribute('style', 'display: none!important')
      }
    })
  }  

  function onAllTasksHandler() {
    Object.entries(objOfTasks).forEach((task, index) => {

      if (task[1].completed) {
        let completedTask = document.querySelector(`.tasks-list-section .list-group li:nth-child(${Object.entries(objOfTasks).length-index})`)
        completedTask.setAttribute('style', 'display: flex!important')
        completedTask.style.backgroundColor = '#bcdcff';
      }
    })
  }

  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value;
    const isComfirmed = confirm(`Вы действительно хотите изменить тему на ${selectedTheme}?`);
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