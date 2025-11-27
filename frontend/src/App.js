import React, { useState, useCallback } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthContext } from './contexts/AuthContext';

function App() {
  const [authState, setAuthState] = useState({
    token: null,
    user: null
  });

  const login = useCallback((token, user) => {
    setAuthState({ token, user });
  }, []);

  const logout = useCallback(() => {
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

