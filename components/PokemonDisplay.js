'use client';

export default function PokemonDisplay({ pokemon, species, onToggleFavorite, isFavorite }) {
  if (!pokemon) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
          Enter a Pokémon name or ID to begin
        </div>
        <div style={{ fontSize: '12px', color: '#999' }}>
          Try: pikachu, charizard, 25, 6
        </div>
      </div>
    );
  }

  const getTypeColor = (type) => {
    const colors = {
      fire: '#FF6B35',
      water: '#33AAFF',
      grass: '#7DC954',
      electric: '#FFD700',
      psychic: '#FF5BA7',
      ice: '#96D9D6',
      dragon: '#6F35FC',
      dark: '#705746',
      fairy: '#D685AD',
      normal: '#A8A878',
      fighting: '#C22E28',
      flying: '#A98FF3',
      poison: '#A33EA1',
      ground: '#E2BF65',
      rock: '#B6A136',
      bug: '#A6B91A',
      ghost: '#735797',
      steel: '#B7B7CE'
    };
    return colors[type] || '#68A090';
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

  const flavorText = species?.flavor_text_entries?.find(
    entry => entry.language.name === 'en'
  )?.flavor_text?.replace(/[\n\f]/g, ' ') || '';

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggleFavorite}
        className={`favorite-button ${isFavorite ? 'active' : ''}`}
        style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="pokemon-image"
      />

      <div className="pokemon-name">
        {pokemon.name}
      </div>
      
      <div className="pokemon-number">
        {formatNumber(pokemon.id)}
      </div>

      <div className="pokemon-types">
        {pokemon.types.map((typeInfo, index) => (
          <span
            key={index}
            className="type-badge"
            style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>

      <div className="pokemon-stats">
        {pokemon.stats.slice(0, 5).map((stat, index) => (
          <div key={index} className="stat-bar">
            <div className="stat-name">
              {stat.stat.name.toUpperCase()}
            </div>
            <div className="stat-value">
              {stat.base_stat}
            </div>
            <div className="stat-fill">
              <div
                className="stat-fill-inner"
                style={{
                  width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                  backgroundColor: getStatColor(stat.base_stat)
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pokemon-info">
        <div>
          <strong>HT:</strong> {pokemon.height / 10}m
        </div>
        <div>
          <strong>WT:</strong> {pokemon.weight / 10}kg
        </div>
      </div>

      {flavorText && (
        <div className="pokemon-description">
          {flavorText}
        </div>
      )}
    </div>
  );
}
