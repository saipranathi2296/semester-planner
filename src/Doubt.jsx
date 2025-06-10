 import React, { useState, useEffect } from 'react';
import { FiSearch, FiClock, FiSend } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import './doubt.css';

const Doubt = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's search history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/ai/history', {
          credentials: 'include'
        });
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    fetchHistory();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
      
      // Update history locally
      setHistory(prev => [
        { query, createdAt: new Date() },
        ...prev.slice(0, 19) // Keep only 20 most recent
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-search-container">
      <div className="ai-search-header">
        <FaRobot className="ai-logo" />
        <h2>AI Study Assistant</h2>
      </div>

      <form onSubmit={handleSearch} className="ai-search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your subjects..."
            className="ai-search-input"
          />
          <button 
            type="submit" 
            className="ai-search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : (
              <>
                <FiSend className="search-icon" />
                <span>Ask AI</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && <div className="ai-error">{error}</div>}

      {results && (
        <div className="ai-results">
          <h3>Results for: {results.query}</h3>
          <div className="ai-response">
            {results.response.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}

      <div className="search-history">
        <h3>
          <FiClock className="history-icon" />
          Your Recent Searches
        </h3>
        {history.length === 0 ? (
          <p>No search history yet</p>
        ) : (
          <ul>
            {history.map((item, i) => (
              <li 
                key={i} 
                onClick={() => setQuery(item.query)}
                className={query === item.query ? 'active' : ''}
              >
                {item.query}
                <span className="history-date">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Doubt;