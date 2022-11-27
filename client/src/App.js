import { useEffect, useState } from 'react';
import { accessToken, logout, getUserProfile } from './spotify';
import { catchErrors } from './utils';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchProfile = async () => {
      if (token) {
        const { data } = await getUserProfile();
        setProfile(data);
      }
    };
    catchErrors(fetchProfile());
  }, [token]);

  return (
    <div className='App'>
      <header className='App-header'>
        {token ? (
          <>
            <h1>Logged in</h1>
            <button onClick={logout}>Logout</button>

            {profile && (
              <div>
                <h1>{profile.display_name}</h1>
                {profile.images.length && profile.images[0].url && (
                  <img src={profile.images[0].url} alt='User avatar' />
                )}
              </div>
            )}
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
