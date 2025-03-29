import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Add debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      } else if (searchQuery === '' && isSearchActive) {
        // Navigate to home page when search is cleared
        navigate('/');
      }
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(timer);
  }, [searchQuery, navigate, isSearchActive]);

  const handleInputBlur = () => {
    if (!searchQuery) {
      setIsSearchActive(false);
      navigate('/');
    }
  };

  return (
   <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
    <div className='bg-[#121212] h-auto py-3 rounded flex flex-col gap-4'>
     <div onClick={()=>navigate('/')} className='flex items-center gap-3 pl-8 cursor-pointer'>
      <img className='w-6' src={assets.home_icon} alt=""/>
      <p className='font-bold'>Home</p>
     </div>
     
     <div className={`flex items-center gap-3 pl-8 cursor-pointer ${isSearchActive ? 'w-full pr-4' : ''}`}>
       <img className='w-6' src={assets.search_icon} alt=""/>
       {isSearchActive ? (
         <div className='flex-1'>
           <div className='relative w-full'>
             <input
               type="text"
               placeholder="What do you want to play?"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               onBlur={handleInputBlur}
               autoFocus
               className='w-full bg-[#242424] text-white text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 border border-green-500'
             />
           </div>
         </div>
       ) : (
         <p className='font-bold' onClick={() => setIsSearchActive(true)}>Search</p>
       )}
     </div>
     
     <div onClick={() => navigate('/radio')} className='flex items-center gap-3 pl-8 cursor-pointer'>
      <img className='w-6' src={assets.radio_icon} alt=""/>
      <p className='font-bold'>Radio</p>
     </div>
    </div>
    <div className='bg-[#121212] h-[85%] rounded overflow-y-auto mt-2'>
     <div className='flex items-center justify-around mt-3'>
       <div className='flex items-center gap-3'>
         <img className='w-8' src={assets.stack_icon} alt=""/>
         <p className='font-semibold'>Your Library</p>
       </div>
       <div className='flex items-center gap-3'>
         <img className='w-5'src={assets.arrow_icon} alt=""/>
         <img className='w-5'src={assets.plus_icon} alt=""/>
       </div>
     </div>
     <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
       <h1>Create your first playlist</h1>
       <p className='font-light'>is's easy we will help you</p>
       <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Create Playlist</button>
     </div>
     <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-1'>
       <h1>Let's findsome podcasts to follow</h1>
       <p className='font-light'>we'll keep you update on new episodes</p>
       <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Browse podcasts</button>
     </div>
    </div>
   </div>
  )
}

export default Sidebar