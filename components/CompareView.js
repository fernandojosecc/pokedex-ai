'use client';

import { useState } from 'react';

export default function CompareView({ pokemon, onCompare }) {
  const [comparePokemon, setComparePokemon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokémon not found');
      }
      const data = await response.json();
      setComparePokemon(data);
    } catch (error) {
      alert('Pokémon not found. Please try another name or ID.');
      setComparePokemon(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatColor = (stat) => {
    if (stat >= 100) return '#4caf50';
    if (stat >= 60) return '#8bc34a';
    if (stat >= 30) return '#ffc107';
    return '#ff5722';
  };

  const formatNumber = (num) => {
    return `#${String(num).padStart(3, '0')}`;
  };

  if (!pokemon) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        Search for a Pokémon first to compare
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px', padding: '15px', background: '#f8f8f8', borderRadius: '10px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#333' }}>
        COMPARE POKÉMON
      </h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter Pokémon to compare"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: 1,
            padding: '8px',
            border: '2px solid #880000',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'Courier New, monospace'
          }}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          style={{
            padding: '8px 15px',
            background: '#880000',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? '...' : 'ADD'}
        </button>
      </div>

      {comparePokemon && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ 
            padding: '10px', 
            background: 'white', 
            borderRadius: '8px',
            border: '2px solid #880000'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                style={{ width: '60px', height: '60px', marginBottom: '5px' }}
              />
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {pokemon.name.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {formatNumber(pokemon.id)}
              </div>
            </div>
            <div style={{ fontSize: '11px' }}>
              {pokemon.stats.slice(0, 5).map((stat, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ width: '50px', fontSize: '10px' }}>{stat.stat.name}</span>
                  <div style={{ flex: 1, height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                        backgroundColor: getStatColor(stat.base_stat)
                      }}
                    />
                  </div>
                  <span style={{ width: '25px', textAlign: 'right', fontSize: '10px', marginLeft: '5px' }}>
                    {stat.base_stat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            padding: '10px', 
            background: 'white', 
            borderRadius: '8px',
            border: '2px solid #880000'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <img
                src={comparePokemon.sprites.front_default}
                alt={comparePokemon.name}
                style={{ width: '60px', height: '60px', marginBottom: '5px' }}
              />
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {comparePokemon.name.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {formatNumber(comparePokemon.id)}
              </div>
            </div>
            <div style={{ fontSize: '11px' }}>
              {comparePokemon.stats.slice(0, 5).map((stat, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ width: '50px', fontSize: '10px' }}>{stat.stat.name}</span>
                  <div style={{ flex: 1, height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                        backgroundColor: getStatColor(stat.base_stat)
                      }}
                    />
                  </div>
                  <span style={{ width: '25px', textAlign: 'right', fontSize: '10px', marginLeft: '5px' }}>
                    {stat.base_stat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
