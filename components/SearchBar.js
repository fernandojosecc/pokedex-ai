'use client';

export default function SearchBar({ searchQuery, setSearchQuery, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Enter Pokémon name or ID"
        className="search-input"
      />
      <button type="submit" className="search-button">
        GO
      </button>
    </form>
  );
}
