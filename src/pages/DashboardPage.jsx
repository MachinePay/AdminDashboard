import { useState, useEffect } from 'react';
import { getDashboardData } from '../services/api';
import Header from '../components/Header';
import SummaryCard from '../components/SummaryCard';
import StoreTable from '../components/StoreTable';
import './DashboardPage.css';

function DashboardPage({ onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDashboardData();
      setData(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
      if (err.message === 'Senha inválida') {
        setTimeout(() => onLogout(), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateAvgTicket = () => {
    if (!data || data.global_stats.total_orders === 0) return 0;
    return data.global_stats.total_revenue / data.global_stats.total_orders;
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  if (loading && !data) {
    return (
      <>
        <Header onLogout={onLogout} />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando dashboard...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header onLogout={onLogout} />
        <div className="error-container">
          <div className="error-box">
            <h2>❌ Erro ao carregar dados</h2>
            <p>{error}</p>
            <button onClick={fetchData} className="retry-button">
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="dashboard-page">
      <Header onLogout={onLogout} />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h2>Estatísticas Globais</h2>
            {lastUpdate && (
              <p className="last-update">
                Última atualização: {formatTime(lastUpdate)}
              </p>
            )}
          </div>
          <button
            onClick={fetchData}
            className="refresh-button"
            disabled={loading}
          >
            {loading ? '🔄' : '↻'} Atualizar
          </button>
        </div>

        <div className="summary-grid">
          <SummaryCard
            title="Total de Lojas"
            value={data.global_stats.total_stores}
            icon="🏪"
            color="#FB921D"
            subtitle="Lojas ativas no sistema"
          />
          <SummaryCard
            title="Faturamento Total"
            value={formatCurrency(data.global_stats.total_revenue)}
            icon="💰"
            color="#2D2D2D"
            subtitle="Pedidos pagos/autorizados"
          />
          <SummaryCard
            title="Total de Pedidos"
            value={data.global_stats.total_orders}
            icon="📦"
            color="#FB921D"
            subtitle="Todos os pedidos"
          />
          <SummaryCard
            title="Ticket Médio"
            value={formatCurrency(calculateAvgTicket())}
            icon="📊"
            color="#2D2D2D"
            subtitle="Por pedido"
          />
        </div>

        <div className="secondary-stats">
          <div className="stat-badge">
            <span className="stat-icon">🛍️</span>
            <div>
              <div className="stat-value">
                {data.global_stats.total_products}
              </div>
              <div className="stat-label">Produtos Cadastrados</div>
            </div>
          </div>
          <div className="stat-badge">
            <span className="stat-icon">🔥</span>
            <div>
              <div className="stat-value">
                {data.global_stats.total_active_orders}
              </div>
              <div className="stat-label">Pedidos Ativos</div>
            </div>
          </div>
        </div>

        <StoreTable stores={data.stores} />
      </main>
    </div>
  );
}

export default DashboardPage;
