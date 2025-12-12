# 📋 Endpoints Necessários no Backend

Para que o modal de detalhes da loja funcione com dados reais, o backend precisa implementar os seguintes endpoints:

## 1️⃣ Top 5 Produtos Mais Vendidos

**Endpoint:** `GET /api/super-admin/store/:storeId/top-products`

**Headers necessários:**

```
x-super-admin-password: <senha_do_super_admin>
```

**Resposta esperada:**

```json
[
  {
    "name": "Pizza Margherita",
    "sold": 45,
    "revenue": 2025.0
  },
  {
    "name": "Hambúrguer Especial",
    "sold": 38,
    "revenue": 1216.0
  },
  {
    "name": "Refrigerante 2L",
    "sold": 62,
    "revenue": 527.0
  }
]
```

**Query SQL sugerida:**

```sql
SELECT
  p.name,
  COUNT(oi.id) as sold,
  SUM(oi.price * oi.quantity) as revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.store_id = :storeId
  AND o.payment_status IN ('paid', 'authorized')
GROUP BY p.id, p.name
ORDER BY sold DESC
LIMIT 5
```

---

## 2️⃣ Histórico de Vendas (Últimos 7 Dias)

**Endpoint:** `GET /api/super-admin/store/:storeId/sales-history?days=7`

**Headers necessários:**

```
x-super-admin-password: <senha_do_super_admin>
```

**Query params:**

- `days` (opcional, padrão: 7) - Número de dias para retornar

**Resposta esperada:**

```json
[
  { "day": "Segunda", "date": "2025-12-09", "value": 892.5 },
  { "day": "Terça", "date": "2025-12-10", "value": 1134.2 },
  { "day": "Quarta", "date": "2025-12-11", "value": 756.8 },
  { "day": "Quinta", "date": "2025-12-12", "value": 1289.4 }
]
```

**Query SQL sugerida:**

```sql
SELECT
  DATE(o.created_at) as date,
  CASE
    WHEN DAYOFWEEK(o.created_at) = 1 THEN 'Domingo'
    WHEN DAYOFWEEK(o.created_at) = 2 THEN 'Segunda'
    WHEN DAYOFWEEK(o.created_at) = 3 THEN 'Terça'
    WHEN DAYOFWEEK(o.created_at) = 4 THEN 'Quarta'
    WHEN DAYOFWEEK(o.created_at) = 5 THEN 'Quinta'
    WHEN DAYOFWEEK(o.created_at) = 6 THEN 'Sexta'
    WHEN DAYOFWEEK(o.created_at) = 7 THEN 'Sábado'
  END as day,
  SUM(o.total_amount) as value
FROM orders o
WHERE o.store_id = :storeId
  AND o.payment_status IN ('paid', 'authorized')
  AND o.created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
GROUP BY DATE(o.created_at)
ORDER BY date ASC
```

---

## 📝 Implementação Express.js (Exemplo)

```javascript
// No seu arquivo de rotas do backend (ex: routes/superAdmin.js)

// Top Products
router.get(
  '/store/:storeId/top-products',
  verifySuperAdminPassword,
  async (req, res) => {
    try {
      const { storeId } = req.params;

      const topProducts = await db.query(
        `
      SELECT 
        p.name,
        COUNT(oi.id) as sold,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.store_id = ?
        AND o.payment_status IN ('paid', 'authorized')
      GROUP BY p.id, p.name
      ORDER BY sold DESC
      LIMIT 5
    `,
        [storeId]
      );

      res.json(topProducts);
    } catch (error) {
      console.error('Erro ao buscar top products:', error);
      res.status(500).json({ error: 'Erro ao buscar produtos mais vendidos' });
    }
  }
);

// Sales History
router.get(
  '/store/:storeId/sales-history',
  verifySuperAdminPassword,
  async (req, res) => {
    try {
      const { storeId } = req.params;
      const days = parseInt(req.query.days) || 7;

      const salesHistory = await db.query(
        `
      SELECT 
        DATE(o.created_at) as date,
        CASE 
          WHEN DAYOFWEEK(o.created_at) = 1 THEN 'Domingo'
          WHEN DAYOFWEEK(o.created_at) = 2 THEN 'Segunda'
          WHEN DAYOFWEEK(o.created_at) = 3 THEN 'Terça'
          WHEN DAYOFWEEK(o.created_at) = 4 THEN 'Quarta'
          WHEN DAYOFWEEK(o.created_at) = 5 THEN 'Quinta'
          WHEN DAYOFWEEK(o.created_at) = 6 THEN 'Sexta'
          WHEN DAYOFWEEK(o.created_at) = 7 THEN 'Sábado'
        END as day,
        SUM(o.total_amount) as value
      FROM orders o
      WHERE o.store_id = ?
        AND o.payment_status IN ('paid', 'authorized')
        AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(o.created_at)
      ORDER BY date ASC
    `,
        [storeId, days]
      );

      res.json(salesHistory);
    } catch (error) {
      console.error('Erro ao buscar sales history:', error);
      res.status(500).json({ error: 'Erro ao buscar histórico de vendas' });
    }
  }
);
```

---

## 🚀 Status Atual

- ✅ Frontend preparado para consumir esses endpoints
- ✅ Fallback com dados mockados caso endpoints não existam
- ❌ **Endpoints precisam ser implementados no backend**

## 📌 Próximos Passos

1. Implementar os endpoints no backend (arquivo: `routes/superAdmin.js` ou similar)
2. Testar com curl ou Postman
3. Verificar que os dados aparecem corretamente no modal do frontend
4. Remover dados mockados do frontend se desejar (opcional, pois serve como exemplo)

---

**Backend URL:** https://backendkioskpro.onrender.com
**Repositório Frontend:** MachinePay/AdminDashboard
