import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getUsers } from '../services/api';
import './UserStats.css';

// New component to show user statistics
function UserStats() {
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0
  });
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Fetch all users to calculate stats
    const calculateStats = async () => {
      const allUsers = await getUsers(token, '');
      
      // Calculate statistics
      const adminCount = allUsers.filter(u => u.role === 'admin').length;
      const userCount = allUsers.filter(u => u.role === 'user').length;
      
      setStats({
        total: allUsers.length,
        admins: adminCount,
        users: userCount
      });
    };
    
    calculateStats();
  }, []); // Runs once on mount

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Users</h3>
        <p className="stat-number">{stats.total}</p>
      </div>
      <div className="stat-card">
        <h3>Admins</h3>
        <p className="stat-number">{stats.admins}</p>
      </div>
      <div className="stat-card">
        <h3>Regular Users</h3>
        <p className="stat-number">{stats.users}</p>
      </div>
    </div>
  );
}

export default UserStats;

