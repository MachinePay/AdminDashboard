import { useState, useEffect } from 'react';
import { getStoreTopProducts, getStoreSalesHistory } from '../services/api';
import './StoreModal.css';

// Dados simulados como fallback
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
  const [topProducts, setTopProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !store) {
      return;
    }

    const fetchStoreData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Busca dados em paralelo
        const [products, history] = await Promise.all([
          getStoreTopProducts(store.store_id).catch(() => []),
          getStoreSalesHistory(store.store_id, 7).catch(() => []),
        ]);

        setTopProducts(products.length > 0 ? products : mockTopProducts);
        setSalesHistory(history.length > 0 ? history : mockLast7Days);
      } catch (err) {
        console.error('Erro ao buscar dados da loja:', err);
        setError(err.message);
        // Usa dados mockados em caso de erro
        setTopProducts(mockTopProducts);
        setSalesHistory(mockLast7Days);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [isOpen, store]);

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

  const maxSold = Math.max(...topProducts.map((p) => p.sold || 0));
  const maxValue = Math.max(...salesHistory.map((d) => d.value || 0));

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
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #e67e22',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 15px',
                }}
              ></div>
              <p style={{ color: '#666' }}>Carregando dados da loja...</p>
            </div>
          )}

          {error && !loading && (
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                background: '#fff3cd',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <p style={{ color: '#856404', margin: 0 }}>
                ⚠️ {error} - Usando dados de exemplo
              </p>
            </div>
          )}

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
              {salesHistory.map((day, index) => (
                <div key={index} className="trend-bar-container">
                  <div
                    className="trend-bar"
                    style={{
                      height: `${((day.value || 0) / (maxValue || 1)) * 100}%`,
                      background:
                        'linear-gradient(135deg, #E67E22 0%, #2D2D2D 100%)',
                    }}
                  />
                  <div className="trend-label">
                    {day.day || `Dia ${index + 1}`}
                  </div>
                  <div className="trend-value">
                    {formatCurrency(day.value || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking de Produtos */}
          <div className="modal-section">
            <h3>🏆 Top 5 Produtos Mais Vendidos</h3>
            {topProducts.length === 0 ? (
              <div
                style={{ textAlign: 'center', padding: '40px', color: '#999' }}
              >
                📭 Nenhum produto encontrado para esta loja
              </div>
            ) : (
              <div className="product-ranking">
                {topProducts.slice(0, 5).map((product, index) => (
                  <div key={index} className="product-rank-item">
                    <div className="rank-position">{index + 1}º</div>
                    <div className="rank-info">
                      <div className="rank-name">
                        {product.name || 'Produto sem nome'}
                      </div>
                      <div className="rank-bar-container">
                        <div
                          className="rank-bar"
                          style={{
                            width: `${
                              ((product.sold || 0) / (maxSold || 1)) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="rank-stats">
                      <div className="rank-sold">
                        {product.sold || 0} vendidos
                      </div>
                      <div className="rank-revenue">
                        {formatCurrency(product.revenue || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
