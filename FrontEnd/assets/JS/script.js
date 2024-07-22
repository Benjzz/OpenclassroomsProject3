// Récupération du container
const gallery = document.querySelector('.gallery');

// Récupération des projets
async function getWorks() {
  const reponse = await fetch('http://localhost:5678/api/works');
  return await reponse.json();
}

// Récupération des catégories
async function getCategories() {
  const reponse = await fetch('http://localhost:5678/api/categories');
  return await reponse.json();
}

// Affichage des projets
async function displayWorks() {
  const works = await getWorks();
  works.forEach((work) => {
    createWork(work);
  });
}
displayWorks();

// Création d'un projet
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

// Affichage des catégories
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
displayCategory();

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
filterCategories();

// Changement admin
function adminMode() {
  const logBtn = document.querySelector('.log-btn');
  const categories = document.querySelector('.categories');
  const adminHeader = document.querySelector('.admin-header');
  const header = document.querySelector('header');
  const editBtn = document.querySelector('.projet-edit');
  const addPicture = document.querySelector('.add-picture-btn');
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
    addFormCategory();
  } else {
    categories.style.display = 'flex';
    logBtn.innerText = 'login';
    adminHeader.style.display = 'none';
    header.style.paddingTop = '50px';
    editBtn.style.display = 'none';

    editBtn.removeEventListener('click', openModal);
    addPicture.removeEventListener('click', openModal2);
    btnReturnModal.removeEventListener('click', openModal);
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
  pictureRemove();
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
    alert(`Le projet ${data} a été supprimé`);
  } else {
    alert(`Echec de la suppression du projet ${data}`);
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

  const pictureInput = document.querySelector('#file');
  pictureInput.onchange = picturePreview;

  const btnValider = document.getElementById('valider');
  btnValider.style.background = '#a7a7a7';
  btnValider.addEventListener('click', postPictureSubmit);
}

async function addFormCategory() {
  const categories = await getCategories();
  const selectCategory = document.getElementById('selectCategory');
  selectCategory.innerHTML = '';

  let option = document.createElement('option');
  selectCategory.appendChild(option);

  categories.forEach((category) => {
    option = document.createElement('option');
    option.value = category.id;
    option.innerText = category.name;
    selectCategory.appendChild(option);
  });
}

const pictureDisplay = document.querySelector('#pictureDisplay');
const pictureDisplayImg = document.querySelector('#pictureDisplayImg');

function picturePreview(event) {
  const pictureInput = event.target;
  const [file] = pictureInput.files;
  if (file) {
    pictureDisplayImg.src = URL.createObjectURL(file);
    pictureDisplay.style.display = 'flex';
    document.querySelector('.add-picture').style.display = 'none';

    document.getElementById('valider').style.background = '#1d6154';
  }
}

function pictureRemove() {
  document.getElementById('file').value = '';
  pictureDisplayImg.src = '';
  pictureDisplay.style.display = 'none';
  document.querySelector('.add-picture').style.display = 'flex';
}

function postPictureSubmit(e) {
  e.preventDefault();
  postPicture();
}

async function postPicture() {
  const selectCategory = document.getElementById('selectCategory');

  const title = document.getElementById('titleForm').value;
  const categoryId = selectCategory.value;
  const image = document.getElementById('file').files[0];

  if (formValidation(image, title, categoryId) === true) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('category', categoryId);

    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert('Le projet a été ajouté avec succès');
      displayWorks();
      closeModal();
    } else {
      alert("Échec de l'ajout du projet");
    }
  }
}

function formValidation(image, title, categoryId) {
  if (!image || !title || !categoryId) {
    alert('Veuillez remplir tous les champs.');
    return false;
  }

  return true;
}
