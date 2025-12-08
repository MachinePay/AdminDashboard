import { useState, useEffect } from 'react';
import { auth } from './services/api';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verifica se há autenticação salva ao carregar
    const authenticated = auth.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsChecking(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isChecking) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #FF9500 0%, #2D2D2D 100%)',
        }}
      >
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Carregando...</div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <DashboardPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
