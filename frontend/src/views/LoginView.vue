<template>
  <div class="login-container">
    <AuthForm
      title="Login"
      buttonText="Entrar"
      :showPassword="true"
      :showForgot="true"
      altText="Não tem uma conta? Cadastre-se"
      altLink="/register"
      @submit="handleLogin"
    />
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'; // Importa o Axios
import AuthForm from '../components/AuthForm.vue'; // Ajuste o caminho conforme a localização do seu AuthForm.vue

export default {
  name: 'LoginView',
  components: {
    AuthForm,
  },
  data() {
    return {
      errorMessage: '',    // Para exibir mensagens de erro da API
      successMessage: '',  // Para exibir mensagens de sucesso
    };
  },
  methods: {
    // Este método será passado para o AuthForm via prop @submit
    async handleLogin(formData) {
      this.errorMessage = '';   // Limpa mensagens anteriores
      this.successMessage = '';

      try {
        // Faz a requisição POST para o endpoint de login
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        // Supondo que a API retorna um token ou uma mensagem de sucesso
        if (response.data.token) {
          // Armazenar o token (ex: no localStorage) para autenticação futura
          localStorage.setItem('userToken', response.data.token);
          this.successMessage = 'Login realizado com sucesso! Redirecionando...';
          console.log('Token de autenticação:', response.data.token);

          // Redirecionar para a página principal ou dashboard
          this.$router.push('/dashboard'); // Certifique-se de ter o Vue Router configurado
        } else {
          // Se não houver token mas a resposta for 2xx, pode ser um erro de lógica
          this.errorMessage = response.data.message || 'Credenciais inválidas. Tente novamente.';
        }
      } catch (error) {
        console.error('Erro no login:', error);
        // Lidar com diferentes tipos de erros da API
        if (error.response) {
          // Erro de resposta da API (ex: 401 Unauthorized, 400 Bad Request)
          this.errorMessage = error.response.data.message || 'Erro ao fazer login. Verifique suas credenciais.';
        } else if (error.request) {
          // Requisição feita mas sem resposta (servidor offline, rede)
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else {
          // Algo aconteceu na configuração da requisição que disparou um erro
          this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
        }
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px); /* Ajuste a altura se tiver header/footer */
  background-color: #f0f2f5;
  padding: 20px;
}

.error-message {
  color: #d32f2f; /* Vermelho escuro */
  background-color: #ffebee; /* Fundo vermelho claro */
  border: 1px solid #ef9a9a;
  padding: 10px 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.success-message {
  color: #388e3c; /* Verde escuro */
  background-color: #e8f5e9; /* Fundo verde claro */
  border: 1px solid #a5d6a7;
  padding: 10px 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
}

/* Os estilos do formulário em si vêm do AuthForm.vue */
</style>