import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface HeartReactionProps {
  projectId: number;
  projectTitle: string;
}

// New dedicated JSONBin for reaction tracking
const REACTIONS_BIN_ID = '685393a28960c979a5ac910e'; // New bin ID for reactions
const API_KEY = '$2a$10$wMRaiZnIvQURH/FT61YRp.Lc9dRC.hFWzvDYmahRDx5q63cOftnwi';

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
        // Get current heart counts and IP tracking from dedicated reactions bin
        const response = await axios.get(`https://api.jsonbin.io/v3/b/${REACTIONS_BIN_ID}/latest`, {
          headers: {
            'X-Master-Key': API_KEY
          }
        });

        // Check if response has data
        if (!response.data || !response.data.record) {
          console.error('Invalid response from JSONBin:', response.data);
          setLoading(false);
          return;
        }

        const data = response.data.record;
        const projectReactions = data.projectReactions || {};
        const currentProject = projectReactions[projectId] || { count: 0, ips: [] };
        const currentCount = currentProject.count || 0;
        
        // Check if this IP has already reacted to this project
        const hasReacted = currentProject.ips.includes(userIP);
        
        setHeartCount(currentCount);
        setIsLiked(hasReacted);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching heart count:', error);
        
        // If it's a 404 error, initialize the reactions bin
        if (error.response && error.response.status === 404) {
          console.log('Reactions JSONBin not found, initializing...');
          await initializeReactionsBin();
        }
        
        setLoading(false);
      }
    };

    fetchHeartCount();
  }, [projectId, userIP]);

  // Initialize reactions JSONBin if it doesn't exist
  const initializeReactionsBin = async () => {
    try {
      await axios.put(`https://api.jsonbin.io/v3/b/${REACTIONS_BIN_ID}`, 
        { 
          projectReactions: {},
          metadata: {
            created: new Date().toISOString(),
            description: "Project reaction tracking by IP address"
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
          }
        }
      );
      
      console.log('Reactions JSONBin initialized successfully');
    } catch (error) {
      console.error('Error initializing reactions JSONBin:', error);
    }
  };

  const handleHeartClick = async () => {
    if (!userIP) return;

    try {
      // Get current data from reactions bin
      const response = await axios.get(`https://api.jsonbin.io/v3/b/${REACTIONS_BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });

      // Check if response has data
      if (!response.data || !response.data.record) {
        console.error('Invalid response from JSONBin:', response.data);
        return;
      }

      const data = response.data.record;
      const projectReactions = data.projectReactions || {};
      const currentProject = projectReactions[projectId] || { count: 0, ips: [] };
      const currentCount = currentProject.count || 0;
      const currentIPs = currentProject.ips || [];
      
      let newCount;
      let newIPs;
      
      if (isLiked) {
        // Remove reaction
        newCount = Math.max(0, currentCount - 1);
        newIPs = currentIPs.filter((ip: string) => ip !== userIP);
      } else {
        // Add reaction
        newCount = currentCount + 1;
        newIPs = [...currentIPs, userIP];
      }
      
      // Update project reactions
      projectReactions[projectId] = {
        count: newCount,
        ips: newIPs,
        lastUpdated: new Date().toISOString()
      };
      
      // Update JSONBin with new structure
      await axios.put(`https://api.jsonbin.io/v3/b/${REACTIONS_BIN_ID}`, 
        { 
          projectReactions,
          metadata: {
            ...data.metadata,
            lastUpdated: new Date().toISOString()
          }
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
    } catch (error: any) {
      console.error('Error updating heart count:', error);
      
      // If it's a 404 error, try to initialize and retry
      if (error.response && error.response.status === 404) {
        await initializeReactionsBin();
        // Retry the operation after initialization
        setTimeout(() => {
          handleHeartClick();
        }, 1000);
      }
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