import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import './SearchBar.css';

export default function SearchBar({ setUsers }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      axios
        .get(`https://api.github.com/search/users?q=${debouncedQuery}`)
        .then((res) => setUsers(res.data.items))
        .catch(() => setUsers([]));
    }
  }, [debouncedQuery]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Search GitHub Users..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <FaSearch />
    </div>
  );
}
// After: const [debouncedQuery, setDebouncedQuery] = useState('');
const [suggestions, setSuggestions] = useState([]);

useEffect(() => {
  if (debouncedQuery) {
    axios
      .get(`https://api.github.com/search/users?q=${debouncedQuery}`)
      .then((res) => {
        setUsers(res.data.items);
        setSuggestions(res.data.items.slice(0, 5)); // top 5
      })
      .catch(() => {
        setUsers([]);
        setSuggestions([]);
      });
  }
}, [debouncedQuery]);
