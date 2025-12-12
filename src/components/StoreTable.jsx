import './StoreTable.css';

function StoreTable({ stores, onStoreClick }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateAvgTicket = (revenue, orders) => {
    if (orders === 0) return 0;
    return revenue / orders;
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>📊 Detalhamento por Loja</h2>
        <span className="store-count">{stores.length} loja(s)</span>
      </div>

      <div className="table-wrapper">
        <table className="store-table">
          <thead>
            <tr>
              <th>ID da Loja</th>
              <th>Total de Pedidos</th>
              <th>Faturamento</th>
              <th>Ticket Médio</th>
              <th>Produtos</th>
              <th>Pedidos Ativos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  📭 Nenhuma loja com dados disponíveis
                </td>
              </tr>
            ) : (
              stores.map((store) => (
                <tr key={store.store_id} className="clickable-row">
                  <td>
                    <span className="store-id">{store.store_id}</span>
                  </td>
                  <td>{store.total_orders}</td>
                  <td className="revenue">
                    {formatCurrency(store.total_revenue)}
                  </td>
                  <td>
                    {formatCurrency(
                      calculateAvgTicket(
                        store.total_revenue,
                        store.total_orders
                      )
                    )}
                  </td>
                  <td>{store.total_products}</td>
                  <td>
                    <span
                      className={`badge ${
                        store.active_orders > 0 ? 'active' : 'inactive'
                      }`}
                    >
                      {store.active_orders}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={() => onStoreClick(store)}
                      title="Ver detalhes"
                    >
                      👁️ Detalhes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StoreTable;
