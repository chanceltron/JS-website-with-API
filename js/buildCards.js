const pokeapi = 'https://pokeapi.co/api/v2/pokemon/';

const root = document.documentElement;
const cardWrapper = document.querySelector('.card-wrapper');

const types = [];

const getPokemon = async (url) => {
  const rawData = await (await fetch(url)).json();
  const pokemon = await {
    id: rawData.id,
    name: rawData.name,
    hp: rawData.stats[0].base_stat,
    type: rawData.types[0].type.name,
    abilities: rawData.abilities,
    image: 'https://img.pokemondb.net/artwork/' + rawData.name + '.jpg',
  };
  await buildCard(pokemon);
  await types.push(pokemon.type);
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
    <a class="btn btn-primary round-pill">Add to Team</a>
  </div>
  `;
  let abilitiesContainer = document.createElement('div');
  abilitiesContainer.classList.add('pokemon-abilities');
  pokemon.abilities.forEach((ability) => {
    const abilityName = ability.ability.name;
    let abilityDiv = document.createElement('div');
    abilityDiv.innerText = `${abilityName}`;
    abilitiesContainer.appendChild(abilityDiv);
  });

  cardWrapper.appendChild(cardDiv);
  cardDiv.appendChild(abilitiesContainer);
};

for (let i = 1; i < 152; i++) {
  // const excludedList = [0, 774, 778];
  // const randomNumber = () => {
  //   let number = Math.floor(Math.random() * 151);
  //   if (excludedList.includes(number)) {
  //     randomNumber();
  //   } else {
  //     return number;
  //   }
  // };

  // getPokemon(pokeapi + randomNumber());
  getPokemon(pokeapi + i);
}
