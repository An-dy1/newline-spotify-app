import { useEffect, useState } from 'react';
import { accessToken, logout, getUserProfile } from './spotify';
import { catchErrors } from './helpers/utils';
import { Link, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles';
import { Login, Profile } from './pages';
import styled from 'styled-components/macro';

const StyledLogOutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.5);
  color: var(--white);
  font-size: var(--fz-xs);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

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
      <GlobalStyle />
      <header className='App-header'>
        {token ? (
          <div>
            <div>
              <StyledLogOutButton onClick={logout}>Logout</StyledLogOutButton>

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
                <Route path='/' element={<Profile />}></Route>
              </Routes>
            </div>
            {/* <nav>
              <Link to='/top-artists'>Top Artists</Link>
              <Link to='/playlists/:id'>Playlist</Link>
              <Link to='/playlists'>Playlists</Link>
              <Link to='/top-tracks'>Top Tracks</Link>
              <Link to='/'>Home</Link>
            </nav> */}
          </div>
        ) : (
          <Login />
        )}
      </header>
    </div>
  );
}

export default App;
