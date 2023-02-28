const pokeapi = 'https://pokeapi.co/api/v2/pokemon/';

const root = document.documentElement;
const cardWrapper = document.querySelector('.card-wrapper');
const favoritesContainer = document.getElementById('favoritesContainer');

const getRandomNum = (maxNum) => {
  return Math.floor(Math.random() * maxNum) + 1;
};

const favorites = [];
const types = [];

pokemonTypeCount = (type) => {
  let count = 0;
  types.map((t) => {
    if (t === type) {
      count++;
    }
  });
  return count;
};

const mapFavoritePokemon = () => {
  while (favoritesContainer.firstChild) {
    favoritesContainer.removeChild(favoritesContainer.firstChild);
  }
  favorites.map((fav) => {
    const favoriteCard = buildCard(fav);
    const favoriteCardWithRemove = addRemoveBtn(favoriteCard, fav);
    favoritesContainer.appendChild(favoriteCardWithRemove);
  });
};

const getPokemonMove = (moveName) => {
  return fetch(`https://pokeapi.co/api/v2/move/${moveName}`)
    .then((response) => response.json())
    .then((data) => {
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
    });
};

const updatePokemonMoves = async (pokemon) => {
  const move1 = await getPokemonMove(pokemon.moves[0].name);
  const move2 = await getPokemonMove(pokemon.moves[1].name);

  const updatedPokemon = await {
    ...pokemon,
    moves: [move1, move2],
  };
  return updatedPokemon;
};

const getPokemon = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  const pokemon = await {
    id: data.id,
    name: data.name,
    hp: data.stats[0].base_stat,
    type: data.types[0].type.name,
    moves: [
      { name: data.moves[getRandomNum(data.moves.length)].move.name },
      { name: data.moves[getRandomNum(data.moves.length)].move.name },
    ],
    image: 'https://img.pokemondb.net/artwork/' + data.name + '.jpg',
  };
  const updatedPokemon = await updatePokemonMoves(pokemon);
  const card = await buildCard(updatedPokemon);
  const cardWithFav = await addFavBtn(card, updatedPokemon);
  await cardWrapper.appendChild(cardWithFav);
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
    favortiePokemon(pokemon);
  });
  return cardDiv;
};

const addRemoveBtn = (cardDiv, pokemon) => {
  let cardPopupBox = document.createElement('div');
  cardPopupBox.classList.add('card-popup-box');
  cardPopupBox.innerHTML = `
  <a class="btn btn-primary round-pill remove-btn">Remove from Team</a>
  `;
  cardDiv.appendChild(cardPopupBox);
  const removeBtn = cardDiv.querySelector('.remove-btn');
  removeBtn.addEventListener('click', () => {
    removePokemon(pokemon);
  });
  return cardDiv;
};

const favortiePokemon = (pokemon) => {
  if (favorites.length < 6) {
    favorites.push(pokemon);
    mapFavoritePokemon();
  } else {
    alert('You can only have 6 pokemon on your team!');
  }
};

const removePokemon = (pokemon) => {
  const index = favorites.indexOf(pokemon);
  favorites.splice(index, 1);
  mapFavoritePokemon();
};

const buildFavorites = () => {
  favorites.map((pokemon) => {
    buildCard(pokemon);
  });
};

for (let i = 0; i < 30; i++) {
  getPokemon(pokeapi + getRandomNum(151));
}
