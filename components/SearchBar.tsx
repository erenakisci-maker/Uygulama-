
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Mic, Clock, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

// A small subset of "dictionary" words for the predictive demo
const PREDICTIVE_DICTIONARY = [
  "Philosophy", "Philanthropy", "Philology", "Phosphene", "Phenomenon",
  "Obsequious", "Obstinate", "Obfuscate", "Oblivion", "Observation",
  "Ephemeral", "Eloquent", "Ethereal", "Epiphany", "Equanimity",
  "Serendipity", "Solitude", "Sonorous", "Supine", "Surreptitious",
  "Labyrinth", "Luminous", "Lassitude", "Lugubrious",
  "Petrichor", "Panacea", "Paradigm", "Pernicious"
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const history = localStorage.getItem('lexicon_search_history');
    if (history) {
      try {
        setRecentSearches(JSON.parse(history));
      } catch (e) {
        console.error("Failed to parse search history");
      }
    }
  }, []);

  const addToHistory = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('lexicon_search_history', JSON.stringify(updated));
  };

  useEffect(() => {
    if (query.length >= 2) {
      const matches = PREDICTIVE_DICTIONARY.filter(word => 
        word.toLowerCase().startsWith(query.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToHistory(query.trim());
      onSearch(query);
      setIsFocused(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (word: string) => {
    if (navigator.vibrate) navigator.vibrate(10);
    setQuery(word);
    addToHistory(word);
    onSearch(word);
    setIsFocused(false);
    setSuggestions([]);
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Sesli arama bu tarayıcıda desteklenmiyor.");
      return;
    }

    // @ts-ignore - SpeechRecognition is not fully typed in standard TS lib yet
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'tr-TR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    if (navigator.vibrate) navigator.vibrate(20);

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setQuery(speechResult);
      addToHistory(speechResult);
      onSearch(speechResult);
      setIsListening(false);
      setIsFocused(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`
          relative flex items-center w-full h-14 rounded-2xl transition-all duration-300
          ${isFocused ? 'bg-white shadow-xl ring-2 ring-[#C19A6B]' : 'bg-[#F1F4F8] shadow-sm'}
        `}>
          <Search className={`ml-4 w-5 h-5 transition-colors ${isFocused ? 'text-[#C19A6B]' : 'text-[#4A5568]'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={isListening ? "Dinleniyor..." : "Kelime ara..."}
            className={`w-full h-full bg-transparent px-4 text-lg text-[#111827] placeholder-[#4A5568]/60 focus:outline-none font-medium ${isListening ? 'animate-pulse' : ''}`}
            autoComplete="off"
          />
          
          <div className="flex items-center mr-2">
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-2 rounded-full hover:bg-gray-200 text-[#4A5568] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-2 rounded-full transition-all duration-300 ${isListening ? 'bg-[#C19A6B] text-white scale-110 shadow-lg ring-4 ring-[#C19A6B]/20' : 'hover:bg-gray-200 text-[#4A5568]'}`}
                aria-label="Voice Search"
              >
                {isListening ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Dropdown: Suggestions OR Recent History */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down">
          
          {/* Case 1: Predictive Suggestions */}
          {(suggestions.length > 0) ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-5 py-4 hover:bg-[#F1F4F8] flex items-center group transition-colors border-b border-gray-50 last:border-0"
                  >
                    <Search className="w-4 h-4 text-gray-400 mr-3 group-hover:text-[#C19A6B]" />
                    <span className="text-lg text-[#111827]">
                      <span className="font-bold text-[#1A2238]">{suggestion.substring(0, query.length)}</span>
                      {suggestion.substring(query.length)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
             // Case 2: Recent History (When query is empty)
             (!query && recentSearches.length > 0) ? (
               <div>
                  <div className="px-5 py-2 bg-gray-50 text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">
                    Son Aramalar
                  </div>
                  <ul>
                    {recentSearches.map((term, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleSuggestionClick(term)}
                          className="w-full text-left px-5 py-3 hover:bg-[#F1F4F8] flex items-center group transition-colors border-b border-gray-50 last:border-0"
                        >
                          <Clock className="w-4 h-4 text-gray-400 mr-3 group-hover:text-[#C19A6B]" />
                          <span className="text-lg text-[#111827]">{term}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
               </div>
             ) : (
                // Case 3: Empty State with specific prompt
                query && suggestions.length === 0 && (
                   <div className="px-5 py-4 text-[#4A5568] text-sm italic">
                     "{query}" araması için enter'a bas...
                   </div>
                )
             )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
