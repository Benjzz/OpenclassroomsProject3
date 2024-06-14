// Recuperation du container
const gallery = document.querySelector('.gallery');

// Recuperation des projets
async function getWorks() {
  const reponse = await fetch('http://localhost:5678/api/works');
  return await reponse.json();
}
getWorks();

// Recuperation des categories
async function getCategories() {
  const reponse = await fetch('http://localhost:5678/api/categories');
  return await reponse.json();
}
getCategories();

// Affichage des projects //
async function displayWorks() {
  const works = await getWorks();
  works.forEach((work) => {
    createWork(work);
  });
}

async function createWork(data) {
  const workElement = document.createElement('figure');
  workElement.dataset.category = data.categoryId;

  const imageElement = document.createElement('img');
  imageElement.src = data.imageUrl;
  imageElement.alt = data.title;
  const titleElement = document.createElement('figcaption');
  titleElement.innerText = data.title;

  gallery.appendChild(workElement);
  workElement.appendChild(imageElement);
  workElement.appendChild(titleElement);
}

// Affichage des categories
async function displayCategory() {
  const categories = await getCategories();

  categories.forEach((category) => {
    const categoriesContainer = document.querySelector('.categories');

    const btnCategory = document.createElement('button');
    btnCategory.classList.add('filter-btn');
    btnCategory.innerText = category.name;
    btnCategory.dataset.id = category.id;

    categoriesContainer.appendChild(btnCategory);
  });
}

// Filtre des projets
async function filterCategories() {
  const works = await getWorks();

  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      gallery.innerHTML = '';

      if (button.dataset.id !== '0') {
        const worksFilter = works.filter((work) => {
          return work.categoryId == button.dataset.id;
        });
        worksFilter.forEach((work) => {
          createWork(work);
        });
      } else {
        displayWorks();
      }

      buttons.forEach((button) => {
        button.classList.remove('active');
      });
      button.classList.add('active');
    });
  });
}

displayWorks();
displayCategory();
filterCategories();

// Changement admin

function adminMode() {
  const logBtn = document.querySelector('.log-btn');
  const categories = document.querySelector('.categories');
  const adminHeader = document.querySelector('.admin-header');
  const header = document.querySelector('header');
  const editBtn = document.querySelector('.projet-edit');
  const addPicture = document.querySelector('.add-picture');
  const btnReturnModal = document.querySelector('.fa-arrow-left');

  if (localStorage.getItem('token')) {
    categories.style.display = 'none';
    logBtn.innerText = 'logout';
    adminHeader.style.display = 'flex';
    header.style.paddingTop = '106px';
    editBtn.style.display = 'flex';

    editBtn.addEventListener('click', openModal);
    addPicture.addEventListener('click', openModal2);
    btnReturnModal.addEventListener('click', openModal);
  } else {
    categories.style.display = 'flex';
    logBtn.innerText = 'login';
    adminHeader.style.display = 'none';
    header.style.paddingTop = '50px';
    editBtn.style.display = 'none';

    editBtn.removeEventListener('click', openModal);
    addPicture.removeEventListener('click', openModal2);
    btnReturnModal.removeEventListener('click', openModal());
  }
}
adminMode();

// MODAL
let modal = null;

function openModal(e) {
  e.preventDefault();
  closeModal();
  const modal1 = document.getElementById('modal1');
  modal1.style.display = null;
  modal = modal1;
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
  modalDisplay();
}

function closeModal(e) {
  if (modal === null) return;
  modal.style.display = 'none';
  modal.removeEventListener('click', closeModal);
  modal.querySelectorAll('.js-modal-close').forEach((i) => {
    i.removeEventListener('click', closeModal);
  });
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
  modal = null;
}

function stopPropagation(e) {
  e.stopPropagation();
}

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeModal(e);
  }
});

async function modalDisplay() {
  const works = await getWorks();
  const modalGallery = document.querySelector('.modal-gallery');
  modalGallery.innerHTML = '';

  works.forEach((work) => {
    const modalWork = document.createElement('figure');
    const workImage = document.createElement('img');
    const deleteBtn = document.createElement('i');

    deleteBtn.id = work.id;
    deleteBtn.classList.add('fa-solid', 'fa-trash-can');
    workImage.src = work.imageUrl;
    workImage.alt = work.title;
    modalWork.className = 'modalWork';

    deleteBtn.addEventListener('click', async (event) => {
      const workId = event.target.id;
      await deleteWork(workId);
      displayWorks();
      modalDisplay();
    });

    modalGallery.appendChild(modalWork);
    modalWork.append(workImage, deleteBtn);
  });
}

async function deleteWork(data) {
  const response = await fetch(`http://localhost:5678/api/works/${data}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (response.ok) {
    alert(`Work with id ${data} has been deleted`);
  } else {
    alert(`Failed to delete work with id ${data}`);
  }
}

function openModal2(e) {
  closeModal();
  const modal2 = document.getElementById('modal2');
  modal2.style.display = null;
  modal = modal2;
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

function formValidation(image, title, categoryId) {
  if (image == undefined) {
    alert('Veuillez ajouter une image');
    return false;
  }
  if (title.length == 0) {
    alert('Veuillez ajouter un titre');
    return false;
  }
  if (categoryId == '') {
    alert('Veuillez choisir une catégorie');
    return false;
  } else {
    return true;
  }
}
