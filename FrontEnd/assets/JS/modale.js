// let modal = null;

// function openModal(e) {
//   e.preventDefault();
//   const target = document.querySelector(e.target.getAttribute('href'));
//   target.style.display = null;
//   modal = target;
//   modal.addEventListener('click', closeModal);
//   modal.querySelectorAll('.js-modal-close').forEach((i) => {
//     i.addEventListener('click', closeModal);
//   });
//   modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
//   console.log(e.target.getAttribute('href'));
// }

// function openModal2(e) {
//   e.preventDefault();
// }

// function closeModal(e) {
//   if (modal === null) return;
//   e.preventDefault();
//   modal.style.display = 'none';
//   modal.removeEventListener('click', closeModal);
//   modal.querySelectorAll('.js-modal-close').forEach((i) => {
//     i.removeEventListener('click', closeModal);
//   });
//   modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
//   modal = null;
// }

// function stopPropagation(e) {
//   e.stopPropagation();
// }

// window.addEventListener('keydown', function (e) {
//   if (e.key === 'Escape') {
//     closeModal(e);
//   }
// });
