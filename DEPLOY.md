# 🚀 Guia de Deploy na Vercel

## Passo 1: Preparação

Certifique-se de que seu projeto está commitado no Git:

```bash
git init
git add .
git commit -m "Initial commit - Dashboard Super Admin"
```

## Passo 2: Criar Conta na Vercel

1. Acesse https://vercel.com
2. Faça login com GitHub/GitLab/Bitbucket
3. Autorize o acesso ao repositório

## Passo 3: Deploy via Dashboard Vercel

### Método 1: Import Git Repository

1. Acesse https://vercel.com/new
2. Clique em "Import Project"
3. Selecione seu repositório Git
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Método 2: Deploy via CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Login
vercel login

# Deploy para produção
vercel --prod
```

## Passo 4: Configurar Variáveis de Ambiente

No dashboard da Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - **Name**: `VITE_API_URL`
   - **Value**: URL do seu backend (ex: `https://seu-backend.onrender.com`)
   - **Environment**: Production, Preview, Development

## Passo 5: Configurar Domínio Customizado

### No Dashboard Vercel:

1. Vá em **Settings** → **Domains**
2. Clique em **Add Domain**
3. Digite: `admin.selfmachine.com.br`
4. Siga as instruções para configurar DNS

### Configuração DNS no Registro.br (ou seu provedor):

Adicione um registro CNAME:

```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: 3600
```

**OU** se usar subdomínio:

```
Type: A
Name: admin
Value: 76.76.21.21 (IP da Vercel)
```

## Passo 6: Configurar CORS no Backend

No seu `server.js`, adicione o domínio da Vercel:

```javascript
import cors from 'cors';

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://admin.selfmachine.com.br',
      'https://seu-projeto.vercel.app',
    ],
    credentials: true,
  })
);
```

## Passo 7: Testar Deploy

1. Acesse sua URL da Vercel (ex: `https://seu-projeto.vercel.app`)
2. Ou o domínio customizado: `https://admin.selfmachine.com.br`
3. Faça login com a senha do Super Admin
4. Verifique se os dados carregam corretamente

## 🔧 Configurações Avançadas

### Automatic Deployments

A Vercel faz deploy automático quando você faz push para o Git:

- **main/master branch** → Deploy de Produção
- **outras branches** → Deploy de Preview

### Revert Deploy

Se algo der errado:

1. Vá em **Deployments**
2. Encontre um deploy anterior que funcionava
3. Clique nos 3 pontos → **Promote to Production**

### Logs e Monitoramento

- **Runtime Logs**: Vercel Dashboard → Deployments → View Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Speed Insights**: Vercel Dashboard → Speed Insights

## 🐛 Troubleshooting

### Erro: "VITE_API_URL is not defined"

**Solução**: Configure a variável de ambiente no dashboard da Vercel

### Erro: Build Failed

**Solução**: Execute `npm run build` localmente para identificar o erro

### Erro: CORS Error

**Solução**: Adicione o domínio da Vercel no CORS do backend

### Domínio não funciona

**Solução**:

1. Verifique a configuração DNS
2. Aguarde propagação (pode levar até 48h)
3. Use `nslookup admin.selfmachine.com.br` para verificar

## 📋 Checklist Final

- [ ] Código commitado no Git
- [ ] Deploy na Vercel concluído
- [ ] Variável `VITE_API_URL` configurada
- [ ] CORS configurado no backend
- [ ] Domínio customizado adicionado
- [ ] DNS configurado corretamente
- [ ] Login testado em produção
- [ ] Dados carregando corretamente

## 🌐 URLs Importantes

- **Dashboard Vercel**: https://vercel.com/dashboard
- **Documentação**: https://vercel.com/docs
- **Status da Vercel**: https://vercel-status.com

## 💡 Dicas

1. Use **Preview Deployments** para testar antes de produção
2. Configure **Protection** para senha em ambientes de teste
3. Ative **Analytics** para monitorar uso
4. Use **Edge Functions** se precisar de lógica server-side

## 🎉 Pronto!

Seu dashboard está no ar em:

- https://admin.selfmachine.com.br

Qualquer push no Git fará deploy automático! 🚀
