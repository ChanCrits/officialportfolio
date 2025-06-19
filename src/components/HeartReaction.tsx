import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface HeartReactionProps {
  projectId: number;
  projectTitle: string;
}

const HeartReaction: React.FC<HeartReactionProps> = ({ projectId, projectTitle }) => {
  const [heartCount, setHeartCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHeartCount = async () => {
      try {
        const BIN_ID = '684e32b28a456b7966ae519e';
        const API_KEY = '$2a$10$wMRaiZnIvQURH/FT61YRp.Lc9dRC.hFWzvDYmahRDx5q63cOftnwi';
        
        // Get current heart counts
        const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: {
            'X-Master-Key': API_KEY
          }
        });

        const data = response.data.record;
        const projectHearts = data.projectHearts || {};
        const currentCount = projectHearts[projectId] || 0;
        
        // Check if user has liked this project
        const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
        const hasLiked = likedProjects.includes(projectId);
        
        setHeartCount(currentCount);
        setIsLiked(hasLiked);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching heart count:', error);
        setLoading(false);
      }
    };

    fetchHeartCount();
  }, [projectId]);

  const handleHeartClick = async () => {
    try {
      const BIN_ID = '684e32b28a456b7966ae519e';
      const API_KEY = '$2a$10$wMRaiZnIvQURH/FT61YRp.Lc9dRC.hFWzvDYmahRDx5q63cOftnwi';
      
      // Get current data
      const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });

      const data = response.data.record;
      const projectHearts = data.projectHearts || {};
      const currentCount = projectHearts[projectId] || 0;
      
      // Update count based on like status (prevent negative values)
      let newCount;
      if (isLiked) {
        newCount = Math.max(0, currentCount - 1); // Ensure count doesn't go below 0
      } else {
        newCount = currentCount + 1;
      }
      
      projectHearts[projectId] = newCount;
      
      // Update JSONBin with proper structure
      await axios.put(`https://api.jsonbin.io/v3/b/${BIN_ID}`, 
        { 
          count: data.count || 0,
          projectHearts 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
          }
        }
      );

      // Update local state
      setHeartCount(newCount);
      setIsLiked(!isLiked);
      
      // Update localStorage
      const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
      if (isLiked) {
        const updatedLikedProjects = likedProjects.filter((id: number) => id !== projectId);
        localStorage.setItem('likedProjects', JSON.stringify(updatedLikedProjects));
      } else {
        likedProjects.push(projectId);
        localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
      }
    } catch (error) {
      console.error('Error updating heart count:', error);
    }
  };

  if (loading) {
    return (
      <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600/20 text-gray-400 rounded-md text-sm opacity-50">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleHeartClick}
      className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
        isLiked 
          ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
          : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 hover:text-gray-300'
      }`}
      title={`${isLiked ? 'Unlike' : 'Like'} ${projectTitle}`}
    >
      <svg 
        className={`w-4 h-4 transition-all duration-200 ${isLiked ? 'fill-current' : 'fill-none'}`} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span>{heartCount}</span>
    </button>
  );
};

export default HeartReaction; 