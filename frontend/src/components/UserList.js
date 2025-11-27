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

  const fetchUsers = useCallback(async () => {
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
  }, [token, search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(token, id);
      setUsers(users.filter(u => u.id !== id));
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
            </div>
            {isAdmin && (
              <div className="user-actions">
                <button 
                  onClick={() => handleDelete(user.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            )}
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

