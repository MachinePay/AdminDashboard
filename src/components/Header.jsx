import { auth } from "../services/api";
import "./Header.css";

function Header({ onLogout }) {
  const handleLogout = () => {
    auth.logout();
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>🏪 Super Admin Dashboard</h1>
          <p>Multi-Tenancy System</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          🚪 Sair
        </button>
      </div>
    </header>
  );
}

export default Header;
