import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthContext } from './contexts/AuthContext';

function App() {
  // Persist auth state in localStorage for better UX
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('authToken'),
    user: JSON.parse(localStorage.getItem('user') || 'null')
  });

  const login = useCallback((token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({ token, user });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthState({ token: null, user: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      <div className="App">
        {!authState.token ? (
          <Login />
        ) : (
          <Dashboard />
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;

