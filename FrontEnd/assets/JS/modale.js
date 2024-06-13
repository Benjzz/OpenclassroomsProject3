const editBtn = document.querySelector('.projet-edit');
const modalContainer = document.querySelector('.modal');
const btnCloseModal = document.getElementById('closeModal');

editBtn.addEventListener('click', () => {
  modalContainer.style.display = 'flex';
});

btnCloseModal.addEventListener('click', () => {
  modalContainer.style.display = 'none';
});
