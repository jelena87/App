let selected = null;
const tasks = [
  { id: 'Text', project: null },
  { id: 'HTML', project: null },
  { id: 'Radiobutton', project: null },
  { id: 'Checkbox', project: null },
  { id: 'Date', project: null },
  { id: 'Label', project: null },
];

tasks.forEach((task) => {
  const el = document.createElement('div');
  const project = localStorage.getItem(task.id) || task.project;
  const parent = (project)
    ? document.getElementById(project)
    : document.querySelector('.tasks-container');

  el.classList.add('task');
  el.draggable = true;
  el.innerText = task.id;
  el.id = task.id;

  parent.appendChild(el);
});

document.addEventListener('dragstart', (event) => {
  selected = event.target;

  event.target.style.opacity = .6;
}, false);

document.addEventListener('dragend', (event) => {
  event.target.style.opacity = 1;
}, false);

document.addEventListener('dragover', (event) => {
  event.preventDefault();
}, false);



document.addEventListener('dragleave', (event) => {
  if (!event.target.classList.contains('js-dropzone')) {
    return;
  }

  event.target.classList.remove('is-active');
}, false);

document.addEventListener('drop', (event) => {
  event.preventDefault();

  if (!event.target.classList.contains('js-dropzone')) {
    return;
  }

  selected.parentNode.removeChild(selected);

  event.target.appendChild(selected);
  event.target.classList.remove('is-active');

  if (!event.target.classList.contains('project')) {
    localStorage.removeItem(selected.id);

    return;
  }

  localStorage.setItem(selected.id, event.target.id);
}, false);
