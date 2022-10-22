// setTimeout(() => {
//   const cards = document.querySelectorAll('.card');
//   const buttons = document.querySelectorAll('.slide-ctrl-container button');

//   let current = Math.floor(Math.random() * cards.length);
//   let next = current < cards.length - 1 ? current + 1 : 0;
//   let prev = current > 0 ? current - 1 : cards.length - 1;

//   const update = () => {
//     cards.forEach((card) => {
//       card.classList.remove('active', 'prev', 'next');
//     });
//   };

//   const goToNum = (newCurrentIndex) => {
//     current = newCurrentIndex;
//     next = current < slides.length - 1 ? current + 1 : 0;
//     prev = current > 0 ? current - 1 : slides.length - 1;
//     update();
//   };

//   cards[current].classList.add('active');
//   cards[prev].classList.add('prev');
//   cards[next].classList.add('next');

//   const goToNext = () => (current < cards.length - 1 ? goToNum(current + 1) : goToNum(0));

//   const goToPrev = () => (current > 0 ? goToNum(current - 1) : goToNum(cards.length - 1));

//   for (let i = 0; i < buttons.length; i++) {
//     buttons[i].addEventListener('click', () => (i === 0 ? goToPrev() : goToNext()));
//   }
// }, 500);
