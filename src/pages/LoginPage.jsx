import { useState } from "react";
import { auth, validatePassword } from "../services/api";
import "./LoginPage.css";

function LoginPage({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isValid = await validatePassword(password);

      if (isValid) {
        auth.login(password);
        onLoginSuccess();
      } else {
        setError("Senha inválida. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao validar senha. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🔐 Super Admin</h1>
          <p>Dashboard Multi-Tenancy</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Senha de Acesso</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha do super admin"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={loading || !password}
          >
            {loading ? "🔄 Validando..." : "🚀 Acessar Dashboard"}
          </button>
        </form>

        <div className="login-footer">
          <p>🏪 Selfmachine Multi-Store System</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
