const pokeapi = 'https://pokeapi.co/api/v2/pokemon/';
const root = document.documentElement;
const cardWrapper = document.querySelector('.card-wrapper');
const favoritesContainer = document.getElementById('favoritesContainer');
const typeList = document.getElementById('typeList');

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
const favorites = [];
const types = {};

// Helpers
const getRandomNum = (maxNum) => {
  return Math.floor(Math.random() * maxNum) + 1;
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
        { name: data.moves[getRandomNum(data.moves.length)].move.name },
        { name: data.moves[getRandomNum(data.moves.length)].move.name },
      ],
      image: 'https://img.pokemondb.net/artwork/' + data.name + '.jpg',
    };
    const updatedPokemon = await updatePokemonMoves(pokemon);
    await addPokemonTypes(updatedPokemon);
    const card = await buildCard(updatedPokemon);
    const cardWithFav = await addFavBtn(card, updatedPokemon);
    await cardWrapper.appendChild(cardWithFav);
  } catch (err) {
    return;
  }
};

const updatePokemonMoves = async (pokemon) => {
  const move1 = await getPokemonMove(pokemon.moves[0].name);
  const move2 = await getPokemonMove(pokemon.moves[1].name);
  return {
    ...pokemon,
    moves: [move1, move2],
  };
};

const getPokemonMove = (moveName) => {
  return fetch(`https://pokeapi.co/api/v2/move/${moveName}`)
    .then((response) => response.json())
    .then((data) => {
      // This gets the Effect Chance for each move that has a random chance
      if (data.effect_entries[0].short_effect.includes('$effect_chance')) {
        data.effect_entries[0].short_effect =
          data.effect_entries[0].short_effect.replace(
            '$effect_chance',
            data.effect_chance
          );
      }
      return {
        name: data.name,
        description: data.effect_entries[0].short_effect,
      };
    })
    .catch();
};

addPokemonTypes = (pokemon) => {
  const currType = pokemon.type;
  if (Object.keys(types).includes(currType)) {
    let count = types[currType];
    types[currType] = count + 1;
    return;
  }
  types[currType] = 1;
};

const addPokemonToTeam = () => {
  while (favoritesContainer.firstChild) {
    favoritesContainer.removeChild(favoritesContainer.firstChild);
  }
  favorites.map((fav) => {
    const favoriteCard = buildCard(fav);
    const favoriteCardWithRemove = addRemoveBtn(favoriteCard, fav);
    favoritesContainer.appendChild(favoriteCardWithRemove);
  });
};

const buildCard = (pokemon) => {
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
  `;
  let movesContainer = document.createElement('div');
  movesContainer.classList.add('pokemon-moves');
  pokemon.moves.map((move) => {
    let moveDiv = document.createElement('div');
    moveDiv.innerHTML = `
    <span class='move-name'>${move.name}</span>
    <span class='move-description'>${move.description}</span>
    `;
    movesContainer.appendChild(moveDiv);
    cardDiv.appendChild(movesContainer);
  });
  return cardDiv;
};

const addFavBtn = (cardDiv, pokemon) => {
  let cardPopupBox = document.createElement('div');
  cardPopupBox.classList.add('card-popup-box');
  cardPopupBox.innerHTML = `
  <a class="btn btn-primary round-pill favorite-btn">Add to Team</a>
  `;
  cardDiv.appendChild(cardPopupBox);
  const favoriteBtn = cardDiv.querySelector('.favorite-btn');
  favoriteBtn.addEventListener('click', () => {
    teamAddHandler(pokemon);
  });
  return cardDiv;
};

const addRemoveBtn = (cardDiv, pokemon) => {
  let cardPopupBox = document.createElement('div');
  cardPopupBox.classList.add('card-popup-box');
  cardPopupBox.innerHTML = `
  <a class="btn btn-reject round-pill remove-btn">Remove from Team</a>
  `;
  cardDiv.appendChild(cardPopupBox);
  const removeBtn = cardDiv.querySelector('.remove-btn');
  removeBtn.addEventListener('click', () => {
    removeFromTeamHandler(pokemon);
  });
  return cardDiv;
};

const teamAddHandler = (pokemon) => {
  if (favorites.length < 6) {
    favorites.push(pokemon);
    addPokemonToTeam();
  } else {
    alert('You can only have 6 pokemon on your team!');
  }
};

const removeFromTeamHandler = (pokemon) => {
  const index = favorites.indexOf(pokemon);
  favorites.splice(index, 1);
  addPokemonToTeam();
};

const buildTypeCount = () => {
  const arrayOfTypes = Object.entries(types);
  arrayOfTypes.forEach((type) => {
    typeList.innerHTML += `<li>${type[0]} type: ${type[1]}</li>`;
  });
};

const start = async () => {
  for (let i = 0; i < 30; i++) {
    await getPokemon(pokeapi + getRandomNum(151));
  }
  await buildTypeCount();
};

start();
