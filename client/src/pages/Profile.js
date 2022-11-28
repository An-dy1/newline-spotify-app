import { useState, useEffect } from 'react';
import { catchErrors } from '../helpers/utils';
import { Link } from 'react-router-dom';
import {
  getUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
  getTopTracks,
} from '../spotify';
import { ArtistsGrid, SectionWrapper, TrackList } from '../components';
import { StyledHeader } from '../styles';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getUserProfile();
      setProfile(userProfile.data);

      const playlists = await getCurrentUserPlaylists();
      setPlaylists(playlists.data);

      const topArtists = await getTopArtists();
      setTopArtists(topArtists.data);

      const topTracks = await getTopTracks();
      setTopTracks(topTracks.data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <>
      {profile && (
        <StyledHeader type='user'>
          <div className='header__inner'>
            {profile.images.length && profile.images[0].url && (
              <img
                className='header__img'
                src={profile.images[0].url}
                alt='Avatar'
              />
            )}
            <div>
              <div className='header__overline'>Profile</div>
              <h1 className='header__name'>{profile.display_name}</h1>
              <p className='header__meta'>
                {playlists && (
                  <span>
                    {playlists.total} playlist{playlists.total !== 1 ? 's' : ''}
                  </span>
                )}
                <span>
                  {profile.followers.total} Follower
                  {profile.followers.total !== 1 ? 's' : ''}
                </span>
              </p>
            </div>
          </div>
        </StyledHeader>
      )}

      <nav>
        <Link to='/top-artists'>Top Artists</Link>
        <Link to='/playlists/:id'>Playlist</Link>
        <Link to='/playlists'>Playlists</Link>
        <Link to='/top-tracks'>Top Tracks</Link>
        <Link to='/'>Home</Link>
      </nav>

      {topArtists || topTracks ? (
        <main>
          {topArtists && (
            <SectionWrapper
              title='Top Artists this month'
              seeAllLink='/top-artists'
            >
              <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
            </SectionWrapper>
          )}

          {topTracks && (
            <SectionWrapper
              title='Top Tracks this month'
              seeAllLink='/top-tracks'
            >
              <TrackList tracks={topTracks.items.slice(0, 10)} />
            </SectionWrapper>
          )}
        </main>
      ) : (
        <p>No data to display</p>
      )}
    </>
  );
};

export default Profile;
