const pokeapi = fetch('https://pokeapi.co/api/v2/pokemon/1');
const allPokemon = [];

for (let i = 1; i < 152; i++) {
  let currentPokemon = fetch(`https://pokeapi.co/api/v2/pokemon/${[i]}`);
  // currentPokemon.then((data) => data.json()).then((data) => console.log(data));
  currentPokemon
    .then((data) => data.json())
    .then((data) => allPokemon.push({ id: data.id, name: data.name, type: data.types[0].type.name, abilities: data.abilities, image: data.sprites.front_default }));
}

pokeapi.then((data) => data.json()).then((data) => console.log(data));

setTimeout(() => {
  console.log(allPokemon);
}, 1000);
