import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get('/api/hello');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Error loading message from server.');
      }
    };
    
    fetchMessage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-8 text-blue-400">Contest Alert</h1>
      <p className="text-xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        Backend says: <span className="text-green-400 font-semibold">{message}</span>
      </p>
    </div>
  );
}

export default App;
