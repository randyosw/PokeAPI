import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Axios from "axios";
import PokemonDetails from './pages/PokemonDetails.js';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonPerPage] = useState(10); // Number of Pokémon per page

  useEffect(() => {
    const fetchPokemonList = async () => {
      const offset = (currentPage - 1) * pokemonPerPage;
      const response = await Axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`);
      const fetchedPokemon = await Promise.all(response.data.results.map(async (pokemon) => {
        const pokemonDetails = await Axios.get(pokemon.url);
        return {
          name: pokemon.name,
          img: pokemonDetails.data.sprites.front_default,
          url: pokemon.url,
        };
      }));
      setPokemonList(fetchedPokemon);
      setFilteredPokemonList(fetchedPokemon);
      setTotalPages(Math.ceil(response.data.count / pokemonPerPage));
    };

    fetchPokemonList();
  }, [currentPage, pokemonPerPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    if (searchTerm === "") {
      setFilteredPokemonList(pokemonList);
    } else {
      const filtered = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm)
      );
      setFilteredPokemonList(filtered);
    }
  };

  return (
    <Router>
      <div className="App">
        <div className="TitleSection">
          <h1>Pokémon List</h1>
          <input 
            type="text" 
            placeholder="Search Pokémon"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="DisplaySection">
          {filteredPokemonList.map((pokemon, index) => (
            <div 
              key={index} 
              className="PokemonCard"
            >
              <h2>{pokemon.name}</h2>
              <img src={pokemon.img} alt={pokemon.name} />
              <Link className='DisplayDetails' to={`/pokemon/${pokemon.name}`}>View Details</Link>
            </div>
          ))}
        </div>
        <Stack spacing={2} className="Pagination">
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            shape="rounded"
          />
        </Stack>
        <Routes>
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
