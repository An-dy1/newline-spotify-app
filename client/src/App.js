import { useEffect, useState } from 'react';
import { accessToken, logout } from './spotify';
import logo from './logo.svg';
import './App.css';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        {token ? (
          <>
            <h1>You're logged in already</h1>
            <button onClick={logout}></button>
          </>
        ) : (
          <a className='App-link' href='http://localhost:8888/login'>
            Log in to Spotify
          </a>
        )}
      </header>
    </div>
  );
}

export default App;
