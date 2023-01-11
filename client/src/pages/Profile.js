import { useState, useEffect } from 'react';
import { catchErrors } from '../helpers/utils';
import { Link } from 'react-router-dom';
import {
  getUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
  getTopTracks,
  getSavedShows,
} from '../spotify';
import {
  ArtistsGrid,
  SectionWrapper,
  TrackList,
  ShowsList,
} from '../components';
import { StyledHeader } from '../styles';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [shows, setShows] = useState(null);

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

      const savedShows = await getSavedShows();
      setShows(savedShows.data);

      console.log(savedShows.data);
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
        <Link to='/saved-shows'>Saved Shows</Link>
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
          {shows && (
            <>
              <p>{shows.items[0].show.name}</p>
            </>
          )}
          {shows && (
            <>
              <SectionWrapper
                title='Your Saved Shows'
                seeAllLink='/saved-shows'
              ></SectionWrapper>
              <ShowsList topShows={shows.items} />
            </>
          )}
        </main>
      ) : (
        <p>No data to display</p>
      )}
    </>
  );
};

export default Profile;
