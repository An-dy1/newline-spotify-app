import { useEffect, useState } from 'react';
import { accessToken, logout, getUserProfile } from './spotify';
import { catchErrors } from './utils';
import { Link, Routes, Route } from 'react-router-dom';
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
          <div>
            <div>
              <nav>
                <Link to='/top-artists'>Top Artists</Link>
                <Link to='/playlists/:id'>Playlist</Link>
                <Link to='/playlists'>Playlists</Link>
                <Link to='/top-tracks'>Top Tracks</Link>
                <Link to='/'>Home</Link>
              </nav>

              <Routes>
                <Route
                  path='/top-artists'
                  element={<h1>Top Artists</h1>}
                ></Route>
                <Route path='/top-tracks' element={<h1>Top Tracks</h1>}></Route>
                <Route
                  path='/playlists/:id'
                  element={<h1>Playlist</h1>}
                ></Route>
                <Route path='/playlists' element={<h1>Playlists</h1>}></Route>
                <Route
                  path='/'
                  element={
                    <>
                      <button onClick={logout}>Log out</button>

                      {profile && (
                        <div>
                          <h1>{profile.display_name}</h1>
                          <p>{profile.followers.total} Followers</p>
                          {profile.images.length > 0 &&
                            profile.images[0].url && (
                              <img src={profile.images[0].url} alt='profile' />
                            )}
                        </div>
                      )}
                    </>
                  }
                ></Route>
              </Routes>
            </div>
          </div>
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
