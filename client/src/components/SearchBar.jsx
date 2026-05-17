import { useState, useEffect, useRef } from 'react';
import { getCitySuggestions } from '../services/api';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce — wait 300ms after user stops typing before calling API
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getCitySuggestions(query);
        setSuggestions(res.data.suggestions);
        setShowDropdown(true);
      } catch (err) {
        console.error('Suggestions failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    // Cleanup — cancel timer if user types again before 300ms
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (suggestion) => {
    setQuery(suggestion.name);
    setShowDropdown(false);
    setSuggestions([]);
    onSearch(suggestion.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    onSearch(query);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder="Search city... (e.g. Mumbai, London, Tokyo)"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
          />

          {/* Loading spinner inside input */}
          {loading && (
            <div className="absolute right-4 top-3.5">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-sm"
        >
          Search
        </button>
      </form>

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-5 py-3 hover:bg-blue-50 transition flex items-center gap-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-400">📍</span>
              <div>
                <p className="font-medium text-gray-800">{suggestion.name}</p>
                <p className="text-xs text-gray-400">{suggestion.label}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {showDropdown && suggestions.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-400 text-sm">
          No cities found for "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;