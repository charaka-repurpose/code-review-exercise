import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import UserList from './UserList';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <header className="header">
        <h1>User Management Dashboard</h1>
        <div className="header-right">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      <div className="container">
        <UserList />
      </div>
    </div>
  );
}

export default Dashboard;

