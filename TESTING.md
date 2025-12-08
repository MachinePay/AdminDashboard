# 🧪 Testando o Dashboard Localmente

## ✅ Pré-requisitos

1. Backend rodando em `http://localhost:3001`
2. Variável `SUPER_ADMIN_PASSWORD` configurada no backend
3. Frontend rodando em `http://localhost:5173`

## 🚀 Passo a Passo

### 1. Configurar Backend

No diretório do backend, crie um arquivo `.env`:

```env
PORT=3001
SUPER_ADMIN_PASSWORD=admin123
DATABASE_URL=postgresql://...  # ou deixe vazio para SQLite
```

Inicie o backend:

```bash
node server.js
```

Você deve ver:

```
✅ Servidor rodando na porta 3001
🗄️ Usando banco: SQLite (Local)
```

### 2. Configurar Frontend

No diretório do frontend, verifique `.env.local`:

```env
VITE_API_URL=http://localhost:3001
```

Inicie o frontend:

```bash
npm run dev
```

Você deve ver:

```
VITE v7.2.7  ready in 835 ms
➜  Local:   http://localhost:5173/
```

### 3. Testar Login

1. Acesse http://localhost:5173
2. Digite a senha: `admin123` (ou a que você configurou)
3. Clique em "Acessar Dashboard"

**Resultado esperado**: Você deve ser redirecionado para o dashboard

### 4. Verificar Dashboard

Você deve ver:

✅ **Cards de Estatísticas**:

- Total de Lojas
- Faturamento Total
- Total de Pedidos
- Ticket Médio

✅ **Estatísticas Secundárias**:

- Produtos Cadastrados
- Pedidos Ativos

✅ **Tabela de Lojas**:

- ID da Loja
- Total de Pedidos
- Faturamento
- Ticket Médio
- Produtos
- Pedidos Ativos

### 5. Testar Atualização

Clique no botão "↻ Atualizar" no topo do dashboard.

**Resultado esperado**:

- Dados devem recarregar
- "Última atualização" deve atualizar
- Spinner deve aparecer brevemente

### 6. Testar Auto-Refresh

Aguarde 30 segundos sem interagir.

**Resultado esperado**:

- Dados devem atualizar automaticamente
- "Última atualização" deve mudar

### 7. Testar Logout

Clique no botão "🚪 Sair" no canto superior direito.

**Resultado esperado**:

- Você deve voltar para a tela de login
- LocalStorage deve ser limpo

### 8. Testar Senha Inválida

1. Na tela de login, digite uma senha errada
2. Clique em "Acessar Dashboard"

**Resultado esperado**:

- Mensagem de erro: "Senha inválida. Tente novamente."
- Você deve permanecer na tela de login

## 🧪 Casos de Teste

### Teste 1: Sem Dados no Banco

**Cenário**: Banco de dados vazio

**Resultado esperado**:

- Todas as estatísticas zeradas
- Mensagem: "📭 Nenhuma loja com dados disponíveis"

### Teste 2: Backend Offline

**Cenário**: Backend não está rodando

**Resultado esperado**:

- Tela de erro com mensagem
- Botão "🔄 Tentar Novamente"

### Teste 3: Backend sem SUPER_ADMIN_PASSWORD

**Cenário**: Variável não configurada no backend

**Resposta da API**:

```json
{
  "error": "Super Admin não configurado. Defina SUPER_ADMIN_PASSWORD no servidor."
}
```

### Teste 4: Múltiplas Lojas

**Cenário**: Banco com várias lojas

**Resultado esperado**:

- Tabela com todas as lojas
- Lojas ordenadas por faturamento (maior primeiro)
- Estatísticas globais somando todas

### Teste 5: Pedidos Ativos

**Cenário**: Loja com pedidos status="active"

**Resultado esperado**:

- Badge verde com número de pedidos ativos
- Estatística "Pedidos Ativos" atualizada

### Teste 6: Responsividade

**Ações**:

1. Redimensione a janela
2. Teste em mobile (DevTools → Toggle Device Toolbar)

**Resultado esperado**:

- Cards empilhados em telas pequenas
- Tabela com scroll horizontal
- Header em coluna no mobile

## 🔍 Inspecionar Network

Abra DevTools (F12) → Network:

1. **Request**: `GET /api/super-admin/dashboard`
2. **Headers**:
   - `x-super-admin-password: admin123`
3. **Response**: JSON com `global_stats` e `stores`
4. **Status**: 200 OK

## 📊 Dados de Exemplo

Para popular o banco com dados de teste, execute no backend:

```javascript
// Criar produtos de teste
await db('products').insert([
  { store_id: 'loja1', name: 'Pizza', price: 45.9, category: 'Pizzas' },
  { store_id: 'loja1', name: 'Refrigerante', price: 8.5, category: 'Bebidas' },
  { store_id: 'loja2', name: 'Hambúrguer', price: 32.0, category: 'Lanches' },
]);

// Criar pedidos de teste
await db('orders').insert([
  { store_id: 'loja1', total: 54.4, paymentStatus: 'paid', status: 'active' },
  {
    store_id: 'loja1',
    total: 91.8,
    paymentStatus: 'paid',
    status: 'completed',
  },
  { store_id: 'loja2', total: 32.0, paymentStatus: 'paid', status: 'active' },
]);
```

## ✅ Checklist de Testes

- [ ] Login com senha correta funciona
- [ ] Login com senha incorreta mostra erro
- [ ] Dashboard carrega dados corretamente
- [ ] Estatísticas globais corretas
- [ ] Tabela de lojas ordenada por faturamento
- [ ] Ticket médio calculado corretamente
- [ ] Atualização manual funciona
- [ ] Auto-refresh após 30s funciona
- [ ] Logout limpa localStorage
- [ ] Responsivo em mobile
- [ ] CORS permitindo requisições
- [ ] Erro de backend tratado corretamente

## 🐛 Debug

Se algo não funcionar:

1. **Console do Browser** (F12): Veja erros JavaScript
2. **Network Tab**: Veja requisições HTTP
3. **Application → Local Storage**: Veja dados salvos
4. **Backend Logs**: Veja mensagens do servidor

## 📝 Notas

- A senha é enviada no **header**, não no body
- Dados são atualizados **a cada 30 segundos**
- **LocalStorage** persiste a senha entre reloads
- **Ticket médio** = Faturamento Total / Total de Pedidos
