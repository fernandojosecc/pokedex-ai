export default function PokedexDevice({ children }) {
  return (
    <div className="pokedex-container">
      <div className="pokedex-device">
        <div className="pokedex-top">
          <div className="pokedex-blue-light"></div>
          <div className="pokedex-title">POKÉDEX</div>
          <div className="pokedex-dots">
            <div className="pokedex-dot red"></div>
            <div className="pokedex-dot yellow"></div>
            <div className="pokedex-dot green"></div>
          </div>
        </div>
        <div className="pokedex-hinge"></div>
        {children}
      </div>
    </div>
  );
}
