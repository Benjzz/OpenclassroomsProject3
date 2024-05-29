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

displayWorks();
