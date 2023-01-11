import { formatDuration } from '../helpers/utils';
import { StyledTrackList } from '../styles';

const ShowsList = ({ topShows }) => {
  <p>{topShows[0].show.id}</p>;
};

// const ShowsList = ({ items }) => (
//   <>
//     {items && items.length ? (
//       <StyledTrackList>
//         {items.map((item, i) => (
//           <li className='track__item' key={i}>
//             <div className='track__item__num'>{i + 1}</div>
//             <div className='track__item__title-group'>
//               {item.show.images.length && item.show.images[2] && (
//                 <div className='track__item__img'>
//                   <img src={item.show.images[2].url} alt={item.show.name} />
//                 </div>
//               )}
//               {/* <div className='track__item__name-artist'>
//                 <div className='track__item__name overflow-ellipsis'>
//                   {track.name}
//                 </div>
//                 <div className='track__item__artist overflow-ellipsis'>
//                   {track.artists.map((artist, i) => (
//                     <span key={i}>
//                       {artist.name}
//                       {i !== track.artists.length - 1 && ', '}
//                     </span>
//                   ))}
//                 </div>
//               </div> */}
//             </div>
//             {/* <div className='track__item__album overflow-ellipsis'>
//               {track.album.name}
//             </div>
//             <div className='track__item__duration'>
//               {formatDuration(track.duration_ms)}
//             </div> */}
//           </li>
//         ))}
//       </StyledTrackList>
//     ) : (
//       <p className='empty-notice'>No shows available</p>
//     )}
//   </>
// );

export default ShowsList;
