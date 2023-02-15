const pokeapi = 'https://pokeapi.co/api/v2/pokemon/';

const root = document.documentElement;
const cardWrapper = document.querySelector('.card-wrapper');

const getRandomNum = (maxNum) => {
  return Math.floor(Math.random() * maxNum) + 1;
};

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

const getPokemon = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return {
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
    })
    .then((pokemon) => {
      return updatePokemonMoves(pokemon);
    })
    .then((pokemon) => {
      buildCard(pokemon);
      types.push(pokemon.type);
    })
    .catch((err) => {});
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

  <div class="card-popup-box">
    <a class="btn btn-primary round-pill favorite-btn">Add to Team</a>
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
  });

  cardWrapper.appendChild(cardDiv);
  cardDiv.appendChild(movesContainer);
};

for (let i = 0; i < 30; i++) {
  getPokemon(pokeapi + getRandomNum(151));
}
