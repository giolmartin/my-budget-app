import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState(`Loading API...`);

  useEffect(() => {
    const fetchBe = async () => {
      try {
        const res = await fetch('/api/health');
        if (!res.ok) {
          throw new Error(`HTTP error! status ${res.status}`);
        }
        const data = await res.json();
        setMessage(`${data.status}-${data.message}`);
      } catch (err) {
        setMessage(`Error: ${err.message}`);
      }
    };
    fetchBe();
  }, []);

  return (<div>
    <h1>Budget Allocator App</h1>
    <p>Backend Status:</p>
    <pre>{message}</pre>
  </div>);
}

export default App;
