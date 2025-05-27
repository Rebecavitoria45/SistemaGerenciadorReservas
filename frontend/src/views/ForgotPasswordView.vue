<template>
  <div class="forgot-password-container">
    <AuthForm
      title="Esqueci Minha Senha"
      buttonText="Enviar Link de Reset"
      :showPassword="false" :showForgot="false"
      altText="Voltar para o Login"
      altLink="/login"
      @submit="handleForgotPassword"
    />
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import AuthForm from '../components/AuthForm.vue'; // Ajuste o caminho

export default {
  name: 'ForgotPasswordView',
  components: {
    AuthForm,
  },
  data() {
    return {
      errorMessage: '',
      successMessage: '',
    };
  },
  methods: {
    async handleForgotPassword(formData) {
      this.errorMessage = '';
      this.successMessage = '';

      try {
        // Envia o email para o backend solicitar o link de reset
        const response = await axios.post('/api/auth/forgot-password', {
          email: formData.email,
        });

        this.successMessage = response.data.message || 'Se o e-mail estiver cadastrado, um link para redefinir a senha foi enviado.';
        console.log('Solicitação de reset de senha enviada:', response.data);

        // Opcional: Redirecionar o usuário ou limpar o formulário
        // this.$router.push('/login');

      } catch (error) {
        console.error('Erro ao solicitar reset de senha:', error);
        if (error.response) {
          this.errorMessage = error.response.data.message || 'Erro ao processar sua solicitação. Tente novamente.';
        } else {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        }
      }
    },
  },
};
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  background-color: #f0f2f5;
  padding: 20px;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
  padding: 10px 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.success-message {
  color: #388e3c;
  background-color: #e8f5e9;
  border: 1px solid #a5d6a7;
  padding: 10px 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
}
</style>