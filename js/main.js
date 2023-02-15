//
//
//

/* Modal */
const modalOpen = '[data-open]';
const modalClose = '[data-close]';
const isVisible = 'is-visible';
const openModal = document.querySelectorAll(modalOpen);
const closeModal = document.querySelectorAll(modalClose);

// Modal Open/Close
openModal.forEach((elm) => {
  elm.addEventListener('click', function () {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
  });
});

closeModal.forEach((elm) => {
  elm.addEventListener('click', function () {
    this.parentElement.parentElement.parentElement.classList.remove(isVisible);
  });
});

//
const createTypeList = () => {
  console.log(types);
};
