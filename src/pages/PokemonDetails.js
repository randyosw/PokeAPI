// PokemonDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from "axios";

function PokemonDetails() {
  const { name } = useParams(); // Get the Pokémon name from the URL
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const response = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const pokemonDetails = {
        name: response.data.name,
        img: response.data.sprites.front_default,
        hp: response.data.stats[0].base_stat,
        attack: response.data.stats[1].base_stat,
        defense: response.data.stats[2].base_stat,
        type: response.data.types.map(typeInfo => typeInfo.type.name).join(', '),
      };
      setPokemon(pokemonDetails);
    };

    fetchPokemonDetails();
  }, [name]);

  return (
    <div className="PokemonDetailsPage">
      {pokemon ? (
        <div className="PokemonDetails">
          <h2>{pokemon.name}</h2>
          <img src={pokemon.img} alt={pokemon.name} />
          <h4>Type: {pokemon.type}</h4>
          <h4>HP: {pokemon.hp}</h4>
          <h4>Attack: {pokemon.attack}</h4>
          <h4>Defense: {pokemon.defense}</h4>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}

export default PokemonDetails;
