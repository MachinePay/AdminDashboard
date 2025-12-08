# 🏪 Dashboard Super Admin - Selfmachine

Dashboard administrativo React para gerenciar múltiplas lojas (Multi-tenancy System).

## 🎯 Funcionalidades

✅ Autenticação com senha de Super Admin  
✅ Visualização de estatísticas globais (todas as lojas)  
✅ Detalhamento por loja (faturamento, pedidos, produtos)  
✅ Atualização automática a cada 30 segundos  
✅ Interface responsiva e moderna  
✅ Sistema de login/logout com localStorage

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Iniciar em Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`

### 4. Build para Produção

```bash
npm run build
```

Os arquivos estarão em `dist/`

## 🔐 Autenticação

O dashboard usa a senha configurada no backend:

- Variável: `SUPER_ADMIN_PASSWORD` no servidor
- Header: `x-super-admin-password`
- Storage: Senha salva em `localStorage` após login

## 📊 Endpoints da API

### GET /api/super-admin/dashboard

**Headers:**

```
x-super-admin-password: sua-senha-aqui
```

**Resposta:**

```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "global_stats": {
    "total_stores": 5,
    "total_orders": 1234,
    "total_revenue": 98765.43,
    "total_products": 150,
    "total_active_orders": 12
  },
  "stores": [
    {
      "store_id": "loja1",
      "total_orders": 456,
      "total_revenue": 45678.9,
      "total_products": 50,
      "active_orders": 5
    }
  ]
}
```

## 🎨 Estrutura do Projeto

```
src/
├── components/
│   ├── Header.jsx          # Cabeçalho com logout
│   ├── SummaryCard.jsx     # Cards de estatísticas
│   └── StoreTable.jsx      # Tabela de lojas
├── pages/
│   ├── LoginPage.jsx       # Página de login
│   └── DashboardPage.jsx   # Dashboard principal
├── services/
│   └── api.js              # Serviço de API e auth
├── App.jsx                 # Componente principal
└── main.jsx               # Entry point
```

## 🌐 Deploy na Vercel

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel --prod
```

### 3. Configurar Domínio Customizado

No painel da Vercel:

1. Acesse Settings → Domains
2. Adicione `admin.selfmachine.com.br`
3. Configure DNS no seu provedor

### 4. Variáveis de Ambiente na Vercel

No painel da Vercel:

- Settings → Environment Variables
- Adicione: `VITE_API_URL` com a URL do backend

## 🔧 Tecnologias

- **React 19** - Framework front-end
- **Vite** - Build tool
- **CSS3** - Estilização
- **LocalStorage** - Persistência de autenticação

## 📝 Notas Importantes

1. **CORS**: O backend deve permitir requisições do domínio do dashboard
2. **HTTPS**: Em produção, use sempre HTTPS
3. **Senha**: Nunca exponha `SUPER_ADMIN_PASSWORD` no código front-end
4. **Cache**: Dados atualizados automaticamente a cada 30s

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)

- Verifique se a senha está correta
- Confirme que `SUPER_ADMIN_PASSWORD` está configurada no servidor

### Erro CORS

- Adicione o domínio do dashboard no CORS do backend
- Exemplo: `cors({ origin: ['https://admin.selfmachine.com.br'] })`

### Dados não carregam

- Verifique se `VITE_API_URL` está correto
- Confirme que o backend está rodando
- Verifique os logs do navegador (F12)

## 📄 Licença

Desenvolvido para Selfmachine © 2024
