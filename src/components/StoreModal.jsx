import './StoreModal.css';

// Dados simulados (mover para API depois)
const mockLast7Days = [
  { day: 'Dia 1', value: 892.5 },
  { day: 'Dia 2', value: 1134.2 },
  { day: 'Dia 3', value: 756.8 },
  { day: 'Dia 4', value: 1289.4 },
  { day: 'Dia 5', value: 967.3 },
  { day: 'Dia 6', value: 1456.7 },
  { day: 'Dia 7', value: 1102.9 },
];

const mockTopProducts = [
  { name: 'Pizza Margherita', sold: 45, revenue: 2025.0 },
  { name: 'Hambúrguer Especial', sold: 38, revenue: 1216.0 },
  { name: 'Refrigerante 2L', sold: 62, revenue: 527.0 },
  { name: 'Batata Frita', sold: 31, revenue: 465.0 },
  { name: 'Sorvete', sold: 28, revenue: 392.0 },
];

function StoreModal({ store, onClose, isOpen }) {
  if (!isOpen || !store) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateAvgTicket = () => {
    if (store.total_orders === 0) return 0;
    return store.total_revenue / store.total_orders;
  };

  const maxSold = Math.max(...mockTopProducts.map((p) => p.sold));

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="store-modal">
        <div className="modal-header">
          <div>
            <h2>🏪 Detalhes da Loja</h2>
            <span className="modal-store-id">{store.store_id}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Resumo Rápido */}
          <div className="modal-summary">
            <div className="modal-stat">
              <div className="modal-stat-label">Faturamento Total</div>
              <div className="modal-stat-value">
                {formatCurrency(store.total_revenue)}
              </div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-label">Total de Pedidos</div>
              <div className="modal-stat-value">{store.total_orders}</div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-label">Ticket Médio</div>
              <div className="modal-stat-value">
                {formatCurrency(calculateAvgTicket())}
              </div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-label">Produtos Cadastrados</div>
              <div className="modal-stat-value">{store.total_products}</div>
            </div>
          </div>

          {/* Gráfico de Tendência Simplificado */}
          <div className="modal-section">
            <h3>📈 Tendência de Vendas (Últimos 7 Dias)</h3>
            <div className="trend-chart">
              {mockLast7Days.map((day, index) => (
                <div key={index} className="trend-bar-container">
                  <div
                    className="trend-bar"
                    style={{
                      height: `${(day.value / 1500) * 100}%`,
                      background:
                        'linear-gradient(135deg, #E67E22 0%, #2D2D2D 100%)',
                    }}
                  />
                  <div className="trend-label">{day.day}</div>
                  <div className="trend-value">{formatCurrency(day.value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking de Produtos */}
          <div className="modal-section">
            <h3>🏆 Top 5 Produtos Mais Vendidos</h3>
            <div className="product-ranking">
              {mockTopProducts.map((product, index) => (
                <div key={index} className="product-rank-item">
                  <div className="rank-position">{index + 1}º</div>
                  <div className="rank-info">
                    <div className="rank-name">{product.name}</div>
                    <div className="rank-bar-container">
                      <div
                        className="rank-bar"
                        style={{ width: `${(product.sold / maxSold) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="rank-stats">
                    <div className="rank-sold">{product.sold} vendidos</div>
                    <div className="rank-revenue">
                      {formatCurrency(product.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores Adicionais */}
          <div className="modal-section">
            <h3>📊 Indicadores de Performance</h3>
            <div className="performance-grid">
              <div className="performance-card">
                <div className="perf-icon">🔥</div>
                <div className="perf-label">Pedidos Ativos</div>
                <div className="perf-value">{store.active_orders}</div>
              </div>
              <div className="performance-card">
                <div className="perf-icon">⭐</div>
                <div className="perf-label">Taxa de Conversão</div>
                <div className="perf-value">78%</div>
              </div>
              <div className="performance-card">
                <div className="perf-icon">⏱️</div>
                <div className="perf-label">Tempo Médio</div>
                <div className="perf-value">18min</div>
              </div>
              <div className="performance-card">
                <div className="perf-icon">💳</div>
                <div className="perf-label">Taxa de Sucesso</div>
                <div className="perf-value">94%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StoreModal;
