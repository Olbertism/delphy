import { useRef, useState } from 'react';
import SearchEngineWidget from '../components/dashboard/SearchEngine';
import WikipediaWidget from '../components/dashboard/Wikipedia';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [querySubmitted, setQuerySubmitted] = useState(false);

  const searchQueryInput = useRef(null);

  return (
    <main>
      <div>
        <h1>Dashboard</h1>
        <input
          defaultValue={searchQuery}
          ref={searchQueryInput}
          onChange={() => {
            setQuerySubmitted(false);
          }}
        />
        <button
          onClick={() => {
            setSearchQuery(searchQueryInput.current.value);
            setQuerySubmitted(true);
          }}
        >
          Submit
        </button>
        <SearchEngineWidget query={searchQuery} />
        <WikipediaWidget query={searchQuery} />
      </div>
    </main>
  );
}
