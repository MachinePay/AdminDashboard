const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Debug: Verificar qual URL está sendo usada
console.log('🔗 API_URL configurada:', API_URL);
console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL);

// Armazena a senha do super admin no localStorage
const STORAGE_KEY = 'super_admin_password';

// Funções de autenticação
export const auth = {
  login: (password) => {
    localStorage.setItem(STORAGE_KEY, password);
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getPassword: () => {
    return localStorage.getItem(STORAGE_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEY);
  },
};

// Função para buscar dados do dashboard
export const getDashboardData = async () => {
  const password = auth.getPassword();

  if (!password) {
    throw new Error('Não autenticado');
  }

  const response = await fetch(`${API_URL}/api/super-admin/dashboard`, {
    method: 'GET',
    headers: {
      'x-super-admin-password': password,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    auth.logout();
    throw new Error('Senha inválida');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar dados');
  }

  return await response.json();
};

// Função para validar senha (faz uma requisição de teste)
export const validatePassword = async (password) => {
  const response = await fetch(`${API_URL}/api/super-admin/dashboard`, {
    method: 'GET',
    headers: {
      'x-super-admin-password': password,
      'Content-Type': 'application/json',
    },
  });

  return response.ok;
};
