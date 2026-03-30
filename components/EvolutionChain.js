'use client';

export default function EvolutionChain({ pokemon, evolutionChain, onBack }) {
  const formatNumber = (num) => {
    return `#${String(num).padStart(3, '0')}`;
  };

  const getEvolutionStage = (chain) => {
    const stages = [];
    let current = chain;
    
    while (current) {
      stages.push({
        name: current.species.name,
        url: current.species.url
      });
      current = current.evolves_to[0];
    }
    
    return stages;
  };

  const stages = evolutionChain ? getEvolutionStage(evolutionChain.chain) : [];

  const EvolutionStage = ({ stage, isCurrent }) => (
    <div style={{
      textAlign: 'center',
      padding: '10px',
      background: isCurrent ? '#ffebee' : 'white',
      border: isCurrent ? '3px solid #880000' : '2px solid #ddd',
      borderRadius: '10px',
      minWidth: '100px'
    }}>
      <div style={{ fontSize: '10px', color: '#666', marginBottom: '5px' }}>
        {formatNumber(parseInt(stage.url.split('/')[6]))}
      </div>
      <div style={{ 
        width: '60px', 
        height: '60px', 
        margin: '0 auto 5px',
        background: '#f0f0f0',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px'
      }}>
        🎮
      </div>
      <div style={{ 
        fontWeight: 'bold', 
        fontSize: '12px',
        color: isCurrent ? '#880000' : '#333',
        textTransform: 'uppercase'
      }}>
        {stage.name}
      </div>
      {isCurrent && (
        <div style={{ 
          fontSize: '10px', 
          color: '#880000',
          marginTop: '5px',
          fontWeight: 'bold'
        }}>
          CURRENT
        </div>
      )}
    </div>
  );

  if (!evolutionChain || stages.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          No evolution chain data available
        </div>
        <button
          onClick={onBack}
          style={{
            background: '#880000',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ← BACK
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>
          EVOLUTION CHAIN
        </h3>
        <button
          onClick={onBack}
          style={{
            background: '#880000',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ← BACK
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {stages.map((stage, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <EvolutionStage 
                stage={stage} 
                isCurrent={stage.name === pokemon?.name}
              />
              {index < stages.length - 1 && (
                <div style={{ 
                  fontSize: '20px', 
                  color: '#880000',
                  margin: '0 10px'
                }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        background: '#f9f9f9', 
        borderRadius: '8px',
        fontSize: '11px',
        color: '#666',
        textAlign: 'center'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>EVOLUTION INFO</div>
        <div>
          This shows the complete evolution chain for {pokemon?.name}.
          Pokémon evolve through various methods like leveling up, stones, or trading.
        </div>
      </div>
    </div>
  );
}
