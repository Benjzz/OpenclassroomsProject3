// Recuperation du container
const gallery = document.querySelector('.gallery');

// Recuperation des projets
async function getWorks() {
  const reponse = await fetch('http://localhost:5678/api/works');
  return await reponse.json();
}

// Recuperation des categories
async function getCategories() {
  const reponse = await fetch('http://localhost:5678/api/categories');
  return await reponse.json();
}

// Affichage des projects //
async function displayWorks() {
  const works = await getWorks();
  works.forEach((work) => {
    createWork(work);
  });
}

async function createWork(work) {
  const workElement = document.createElement('figure');
  workElement.dataset.category = work.categoryId;

  const imageElement = document.createElement('img');
  imageElement.src = work.imageUrl;
  imageElement.alt = work.title;
  const titleElement = document.createElement('figcaption');
  titleElement.innerText = work.title;

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
