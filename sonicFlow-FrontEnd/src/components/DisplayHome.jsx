import React, {useContext} from 'react'
import Navbar from './Navbar'
import AlbumItem from './AlbumItem'
import SongItem from './songItem'
import { PlayerContext } from '../context/PlayerContext'

// const DisplayHome = () => {

//    const {songsData, albumsData} = useContext(PlayerContext);

//    return (
//       <>
//       <Navbar />
//       <div className='mb-4'>
//          <h1 className='my-5 font=blod text-2xl'>Featured Charts</h1>
//          <div className='flex flex-row overflow-x-auto gap-4 pb-4 no-scrollbar'>
//            {albumsData.map((item,index)=>(<AlbumItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image}/>))}
//          </div>
//       </div>  
//       <div className='mb-4'>
//          <h1 className='my-5 font=blod text-2xl'>Today's biggest hits</h1>
//          <div className='flex flex-row overflow-x-auto gap-4 pb-4 no-scrollbar'>
//            {songsData.map((item,index)=>(<SongItem key={index} name={item.name} desc={item.desc} id={item.id} image={item.image}/>))}
//          </div>
//       </div>    
//       </>
//    )
// }

// export default DisplayHome

const DisplayHome = () => {
   const { songsData, albumsData } = useContext(PlayerContext);

   return (
      <>
         <Navbar />
         <div className='mb-4'>
            <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
            <div className='flex flex-row overflow-x-auto gap-4 pb-4 no-scrollbar'>
               {Array.isArray(albumsData) && albumsData.length > 0 ? (
                  albumsData.map((item, index) => (
                     <AlbumItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />
                  ))
               ) : (
                  <p>No albums available</p> // Display a message if albumsData is empty or undefined
               )}
            </div>
         </div>  

         <div className='mb-4'>
            <h1 className='my-5 font-bold text-2xl'>Today's biggest hits</h1>
            <div className='flex flex-row overflow-x-auto gap-4 pb-4 no-scrollbar'>
               {Array.isArray(songsData) && songsData.length > 0 ? (
                  songsData.map((item, index) => (
                     <SongItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />
                  ))
               ) : (
                  <p>No songs available</p> // Display a message if songsData is empty or undefined
               )}
            </div>
         </div>
      </>
   );
};

export default DisplayHome;