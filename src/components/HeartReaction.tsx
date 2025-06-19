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
  const [userIP, setUserIP] = useState<string>('');

  // Get user's IP address with caching
  useEffect(() => {
    const getUserIP = async () => {
      // Check if we already have a cached IP
      const cachedIP = localStorage.getItem('userIP');
      if (cachedIP) {
        setUserIP(cachedIP);
        return;
      }

      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        const ip = response.data.ip;
        setUserIP(ip);
        // Cache the IP for future use
        localStorage.setItem('userIP', ip);
      } catch (error) {
        console.error('Error getting IP:', error);
        // Fallback: generate a device fingerprint
        const fingerprint = generateDeviceFingerprint();
        setUserIP(fingerprint);
        // Cache the fingerprint
        localStorage.setItem('userIP', fingerprint);
      }
    };

    getUserIP();
  }, []);

  // Generate a device fingerprint as fallback
  const generateDeviceFingerprint = (): string => {
    // Use more stable device characteristics
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const platform = navigator.platform;
    const cookieEnabled = navigator.cookieEnabled;
    
    // Create a more stable fingerprint
    const fingerprint = `${userAgent}-${language}-${timezone}-${platform}-${cookieEnabled}`;
    return btoa(fingerprint).substring(0, 20); // Base64 encode and truncate
  };

  useEffect(() => {
    if (!userIP) return;

    const fetchHeartCount = async () => {
      try {
        const BIN_ID = '684e32b28a456b7966ae519e';
        const API_KEY = '$2a$10$wMRaiZnIvQURH/FT61YRp.Lc9dRC.hFWzvDYmahRDx5q63cOftnwi';
        
        // Get current heart counts and IP tracking
        const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: {
            'X-Master-Key': API_KEY
          }
        });

        const data = response.data.record;
        const projectHearts = data.projectHearts || {};
        const ipReactions = data.ipReactions || {};
        const currentCount = projectHearts[projectId] || 0;
        
        // Check if this IP has already reacted to this project
        const projectIPs = ipReactions[projectId] || [];
        const hasReacted = projectIPs.includes(userIP);
        
        setHeartCount(currentCount);
        setIsLiked(hasReacted);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching heart count:', error);
        setLoading(false);
      }
    };

    fetchHeartCount();
  }, [projectId, userIP]);

  const handleHeartClick = async () => {
    if (!userIP) return;

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
      const ipReactions = data.ipReactions || {};
      const currentCount = projectHearts[projectId] || 0;
      const projectIPs = ipReactions[projectId] || [];
      
      let newCount;
      let newIPs;
      
      if (isLiked) {
        // Remove reaction
        newCount = Math.max(0, currentCount - 1);
        newIPs = projectIPs.filter((ip: string) => ip !== userIP);
      } else {
        // Add reaction
        newCount = currentCount + 1;
        newIPs = [...projectIPs, userIP];
      }
      
      projectHearts[projectId] = newCount;
      ipReactions[projectId] = newIPs;
      
      // Update JSONBin with proper structure - preserve existing data
      await axios.put(`https://api.jsonbin.io/v3/b/${BIN_ID}`, 
        { 
          count: data.count || 0,
          projectHearts,
          ipReactions
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
    } catch (error) {
      console.error('Error updating heart count:', error);
      // Don't update local state if the API call failed
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