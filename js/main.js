const pokeapi = 'https://pokeapi.co/api/v2/pokemon/';
const root = document.documentElement;
const cardWrapper = document.querySelector('.card-wrapper');
const teamContainer = document.getElementById('favoritesContainer');
const typeList = document.getElementById('typeList');
const sortAZ = document.getElementById('sortAZ');
const sortZA = document.getElementById('sortZA');
const sort19 = document.getElementById('sort19');
const sort91 = document.getElementById('sort91');

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

// Data Structures
const allPokemon = [];
const favorites = [];
const types = {};

// Helper Functions
let sortType = 'id';
let sortReverse = false;
const getRandomNum = (maxNum) => Math.floor(Math.random() * maxNum) + 1;
const sort = (type, reverse) => {
  if (type === 'id') {
    !reverse
      ? allPokemon.sort((a, b) => a.id - b.id)
      : allPokemon.sort((a, b) => b.id - a.id);
  } else if (sortType === 'name') {
    allPokemon.sort((a, b) =>
      !reverse ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }
  while (cardWrapper.firstChild) {
    cardWrapper.removeChild(cardWrapper.firstChild);
  }
  buildAllPokemonCards();
};
const countTypes = (currType) => {
  if (Object.keys(types).includes(currType)) {
    let count = types[currType];
    return (types[currType] = count + 1);
  }
  return (types[currType] = 1);
};

//
const getPokemon = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const pokemon = await {
      id: data.id,
      name: data.name,
      hp: data.stats[0].base_stat,
      type: data.types[0].type.name,
      moves: [
        // Randomly generate two moves for each Pokemon
        await getPokemonMove(
          data.moves[getRandomNum(data.moves.length)].move.name
        ),
        await getPokemonMove(
          data.moves[getRandomNum(data.moves.length)].move.name
        ),
      ],
      image: 'https://img.pokemondb.net/artwork/' + data.name + '.jpg',
    };
    await allPokemon.push(pokemon);
    await countTypes(pokemon.type);
  } catch (err) {}
};

const getPokemonMove = (moveName) => {
  return fetch(`https://pokeapi.co/api/v2/move/${moveName}`)
    .then((response) => response.json())
    .then((move) => {
      // This gets the Effect Chance for each move that has a random chance
      const chance = move.effect_chance;
      let effect = move.effect_entries[0].short_effect;
      if (effect.includes('$effect_chance')) {
        effect = effect.replace('$effect_chance', chance);
      }
      return {
        name: move.name,
        description: effect,
      };
    });
};

const buildAllPokemonCards = () => {
  allPokemon.map((pokemon) => {
    const card = buildIndividualCard(pokemon);
    const cardWithAddBtn = addFavBtn(card, pokemon);
    cardWrapper.appendChild(cardWithAddBtn);
  });
};

const buildIndividualCard = (pokemon) => {
  // Build Main Portion of Card
  let cardDiv = document.createElement('div');
  cardDiv.classList.add('card', `${pokemon.type}`);
  cardDiv.style.backgroundImage = `url(../assets/svg/${pokemon.type}-card-bg.svg)`;
  cardDiv.innerHTML = `
  <div class="card-header">
    <div class="pokemon-name">${pokemon.name}</div>
    <div class="pokemon-info">
      <div class="pokemon-hp">${pokemon.hp} HP</div>
      <div class="pokemon-type">
        <img src="assets/png/${pokemon.type}-type.png" alt="" />
      </div>
    </div>
  </div>
  <div class="pokemon-sprite-wrapper">
    <img src=${pokemon.image} />
  </div>
  <div class="pokemon-moves">
    <div>
      <span class="move-name">${pokemon.moves[0].name}</span>
      <span class="move-description">${pokemon.moves[0].description}</span>
    </div>
    <div>
      <span class="move-name">${pokemon.moves[1].name}</span>
      <span class="move-description">${pokemon.moves[1].description}</span>
    </div>
  </div>
  `;
  return cardDiv;
};

const teamManagementHandler = async (target, pokemon) => {
  const card = target.parentElement.parentElement;
  const addBtn = card.querySelector('.favorite-btn');
  const removeBtn = card.querySelector('.remove-btn');

  if (target.classList.contains('favorite-btn')) {
    if (favorites.length < 6) {
      allPokemon.splice(allPokemon.indexOf(pokemon), 1);
      await favorites.push(pokemon);
      addBtn.parentElement.remove();
      const cardWithRemove = addRemoveBtn(card, pokemon);
      teamContainer.appendChild(cardWithRemove);
    } else {
      alert('You can only have 6 pokemon on your team!');
    }
  } else if (target.classList.contains('remove-btn')) {
    favorites.splice(favorites.indexOf(pokemon), 1);
    await allPokemon.push(pokemon);
    removeBtn.parentElement.remove();
    const cardWithAdd = addFavBtn(card, pokemon);
    cardWrapper.appendChild(cardWithAdd);
  }
  await sort(sortType, sortReverse);
};

// Add Favorite Button Overlay to Card
const addFavBtn = (cardDiv, pokemon) => {
  let cardPopupBox = document.createElement('div');
  cardPopupBox.classList.add('card-popup-box');
  cardPopupBox.innerHTML = `
  <a class="btn btn-primary round-pill favorite-btn">Add to Team</a>
  `;
  cardDiv.appendChild(cardPopupBox);
  const favoriteBtn = cardDiv.querySelector('.favorite-btn');
  favoriteBtn.addEventListener('click', (e) => {
    teamManagementHandler(e.target, pokemon);
  });
  return cardDiv;
};

// Add Remove Button Overlay to Card
const addRemoveBtn = (cardDiv, pokemon) => {
  let cardPopupBox = document.createElement('div');
  cardPopupBox.classList.add('card-popup-box');
  cardPopupBox.innerHTML = `
  <a class="btn btn-reject round-pill remove-btn">Remove from Team</a>
  `;
  cardDiv.appendChild(cardPopupBox);
  const removeBtn = cardDiv.querySelector('.remove-btn');
  removeBtn.addEventListener('click', (e) => {
    teamManagementHandler(e.target, pokemon);
  });
  return cardDiv;
};

// Build the Type List
const buildTypeCount = () => {
  Object.entries(types).forEach(([type, count]) => {
    typeList.innerHTML += `<li>${type} type: ${count}</li>`;
  });
};

// Sort Event Listeners
sortAZ.addEventListener('click', () => {
  sortType = 'name';
  sortReverse = false;
  sort(sortType, sortReverse);
});
sortZA.addEventListener('click', () => {
  sortType = 'name';
  sortReverse = true;
  sort(sortType, sortReverse);
});
sort19.addEventListener('click', () => {
  sortType = 'id';
  sortReverse = false;
  sort(sortType, sortReverse);
});
sort91.addEventListener('click', () => {
  sortType = 'id';
  sortReverse = true;
  sort(sortType, sortReverse);
});

// Start the app
const start = () => {
  const urls = [];
  for (let i = 0; i < 30; i++) {
    urls.push(pokeapi + getRandomNum(151));
  }
  Promise.all(urls.map((url) => getPokemon(url))).then(() => {
    sort(sortType, sortReverse);
    buildAllPokemonCards();
    buildTypeCount();
  });
};

start();
