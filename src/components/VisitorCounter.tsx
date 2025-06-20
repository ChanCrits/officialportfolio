import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VisitorCounter: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const updateVisitorCount = async () => {
      try {
        const BIN_ID = '684e32b28a456b7966ae519e';
        const API_KEY = '$2a$10$wMRaiZnIvQURH/FT61YRp.Lc9dRC.hFWzvDYmahRDx5q63cOftnwi';
        
        // Check if this is a returning visitor
        const hasVisited = localStorage.getItem('hasVisited');
        
        // Get current count
        const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: {
            'X-Master-Key': API_KEY
          }
        });

        const currentCount = response.data.record.count || 0;
        
        // Only increment if this is a new visitor
        if (!hasVisited) {
          const newCount = currentCount + 1;
          
          // Update count
          await axios.put(`https://api.jsonbin.io/v3/b/${BIN_ID}`, 
            { count: newCount },
            { 
              headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
              }
            }
          );

          // Mark this visitor as counted
          localStorage.setItem('hasVisited', 'true');
          setCount(newCount);
        } else {
          setCount(currentCount);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error updating visitor count:', error);
        setLoading(false);
      }
    };

    updateVisitorCount();
  }, []);

  if (loading) {
    return <span className="text-gray-400">Loading...</span>;
  }

  return (
    <div className="flex items-center space-x-2 text-gray-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span>{count.toLocaleString()} visitors</span>
    </div>
  );
};

export default VisitorCounter; 