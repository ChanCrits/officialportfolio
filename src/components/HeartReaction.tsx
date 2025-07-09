import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface HeartReactionProps {
  projectId: number;
  projectTitle: string;
}

// New dedicated JSONBin for reaction tracking
const REACTIONS_BIN_ID = '685393a28960c979a5ac910e'; // New bin ID for reactions
const API_KEY = '$2a$10$wMRaiZnIvQURH/FT61YRp.Lc9dRC.hFWzvDYmahRDx5q63cOftnwi';

// Global cache for reactions data
let reactionsCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

const HeartReaction: React.FC<HeartReactionProps> = ({ projectId, projectTitle }) => {
  const [heartCount, setHeartCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userIP, setUserIP] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

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

  // Fetch reactions data with caching
  const fetchReactionsData = useCallback(async () => {
    const now = Date.now();
    
    // Use cached data if it's still valid
    if (reactionsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      const currentProject = reactionsCache.projectReactions?.[projectId] || { count: 0, ips: [] };
      const hasReacted = currentProject.ips.includes(userIP);
      
      setHeartCount(currentProject.count || 0);
      setIsLiked(hasReacted);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://api.jsonbin.io/v3/b/${REACTIONS_BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });

      if (!response.data || !response.data.record) {
        console.error('Invalid response from JSONBin:', response.data);
        setLoading(false);
        return;
      }

      // Cache the data
      reactionsCache = response.data.record;
      cacheTimestamp = now;

      const projectReactions = reactionsCache.projectReactions || {};
      const currentProject = projectReactions[projectId] || { count: 0, ips: [] };
      const hasReacted = currentProject.ips.includes(userIP);
      
      setHeartCount(currentProject.count || 0);
      setIsLiked(hasReacted);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching heart count:', error);
      
      if (error.response && error.response.status === 404) {
        console.log('Reactions JSONBin not found, initializing...');
        await initializeReactionsBin();
      }
      
      setLoading(false);
    }
  }, [projectId, userIP]);

  useEffect(() => {
    if (!userIP) return;
    fetchReactionsData();
  }, [userIP, fetchReactionsData]);

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
    if (!userIP || isUpdating) return;

    setIsUpdating(true);

    // Optimistic update
    const optimisticCount = isLiked ? Math.max(0, heartCount - 1) : heartCount + 1;
    const optimisticLiked = !isLiked;
    
    setHeartCount(optimisticCount);
    setIsLiked(optimisticLiked);

    // Show notification immediately for likes
    if (!isLiked) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }

    try {
      // Get current data (use cached if available)
      let data;
      if (reactionsCache && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
        data = reactionsCache;
      } else {
        const response = await axios.get(`https://api.jsonbin.io/v3/b/${REACTIONS_BIN_ID}/latest`, {
          headers: {
            'X-Master-Key': API_KEY
          }
        });
        data = response.data.record;
      }

      if (!data) {
        console.error('Invalid response from JSONBin:', data);
        return;
      }

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
      
      // Update JSONBin
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

      // Update cache
      reactionsCache = { projectReactions, metadata: data.metadata };
      cacheTimestamp = Date.now();

      // Update local state with actual values
      setHeartCount(newCount);
      setIsLiked(!isLiked);
    } catch (error: any) {
      console.error('Error updating heart count:', error);
      
      // Revert optimistic update on error
      setHeartCount(isLiked ? heartCount + 1 : Math.max(0, heartCount - 1));
      setIsLiked(isLiked);
      
      if (error.response && error.response.status === 404) {
        await initializeReactionsBin();
      }
    } finally {
      setIsUpdating(false);
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
    <>
      <button
        onClick={handleHeartClick}
        disabled={isUpdating}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
          isLiked 
            ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
            : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 hover:text-gray-300'
        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Thank You Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20 flex items-center space-x-3">
            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-white">Thank you!</p>
              <p className="text-sm text-gray-200">Thanks for liking "{projectTitle}"!</p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeartReaction; 