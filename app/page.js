'use client';

import { useState, useEffect } from 'react';
import PokedexDevice from '../components/PokedexDevice';
import Screen from '../components/Screen';
import SearchBar from '../components/SearchBar';
import PokemonDisplay from '../components/PokemonDisplay';
import AiChat from '../components/AiChat';
import CompareView from '../components/CompareView';
import EvolutionChain from '../components/EvolutionChain';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [currentView, setCurrentView] = useState('display'); // display, chat, evolution
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('pokedex-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && favorites.length > 0) {
      localStorage.setItem('pokedex-favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const searchPokemon = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // Search for Pokémon
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`);
      if (!pokemonResponse.ok) {
        throw new Error('Pokémon not found');
      }
      const pokemonData = await pokemonResponse.json();
      setPokemon(pokemonData);

      // Get species data for flavor text and evolution chain
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`);
      if (speciesResponse.ok) {
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData);

        // Get evolution chain
        if (speciesData.evolution_chain) {
          const evolutionResponse = await fetch(speciesData.evolution_chain.url);
          if (evolutionResponse.ok) {
            const evolutionData = await evolutionResponse.json();
            setEvolutionChain(evolutionData);
          }
        }
      }

      setCurrentView('display');
    } catch (error) {
      alert('Pokémon not found. Please try another name or ID.');
      setPokemon(null);
      setSpecies(null);
      setEvolutionChain(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!pokemon) return;
    
    const isFavorite = favorites.includes(pokemon.name);
    if (isFavorite) {
      setFavorites(favorites.filter(name => name !== pokemon.name));
    } else {
      setFavorites([...favorites, pokemon.name]);
    }
  };

  const loadFavorite = (pokemonName) => {
    setSearchQuery(pokemonName);
    // Trigger search after a brief delay to ensure state is updated
    setTimeout(() => {
      searchPokemon();
    }, 100);
  };

  const isFavorite = pokemon ? favorites.includes(pokemon.name) : false;

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading Pokédex...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <PokedexDevice>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={searchPokemon}
        />

        <Screen>
          {currentView === 'display' && (
            <PokemonDisplay
              pokemon={pokemon}
              species={species}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
          )}
          
          {currentView === 'chat' && (
            <AiChat
              pokemon={pokemon}
              onBack={() => setCurrentView('display')}
            />
          )}
          
          {currentView === 'evolution' && (
            <EvolutionChain
              pokemon={pokemon}
              evolutionChain={evolutionChain}
              onBack={() => setCurrentView('display')}
            />
          )}
        </Screen>

        <div className="pokedex-buttons">
          <button
            className="pokedex-button"
            onClick={() => setCurrentView('display')}
            disabled={!pokemon}
            style={{ 
              opacity: !pokemon ? 0.5 : 1,
              cursor: !pokemon ? 'not-allowed' : 'pointer'
            }}
          >
            STATS
          </button>
          <button
            className="pokedex-button"
            onClick={() => setCurrentView('chat')}
            disabled={!pokemon}
            style={{ 
              opacity: !pokemon ? 0.5 : 1,
              cursor: !pokemon ? 'not-allowed' : 'pointer'
            }}
          >
            ASK AI
          </button>
          <button
            className="pokedex-button"
            onClick={() => setCurrentView('evolution')}
            disabled={!pokemon}
            style={{ 
              opacity: !pokemon ? 0.5 : 1,
              cursor: !pokemon ? 'not-allowed' : 'pointer'
            }}
          >
            EVOLVE
          </button>
          <button
            className="pokedex-button"
            disabled={!pokemon}
            style={{ 
              opacity: !pokemon ? 0.5 : 1,
              cursor: !pokemon ? 'not-allowed' : 'pointer'
            }}
          >
            MOVES
          </button>
        </div>
      </PokedexDevice>

      <CompareView pokemon={pokemon} />

      {favorites.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#f8f8f8', 
          borderRadius: '10px',
          maxWidth: '420px',
          width: '100%'
        }}>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '14px', 
            color: '#333',
            textAlign: 'center'
          }}>
            ❤️ FAVORITES
          </h4>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {favorites.map(name => (
              <button
                key={name}
                onClick={() => loadFavorite(name)}
                style={{
                  padding: '5px 10px',
                  background: '#880000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'Courier New, monospace',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#ff3333';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#880000';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
