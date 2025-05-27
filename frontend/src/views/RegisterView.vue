<template>
  <div class="register-container">
    <AuthForm
      title="Criar Conta"
      buttonText="Cadastrar"
      :showPassword="true"
      :showForgot="false"
      altText="Já tem uma conta? Faça login"
      altLink="/login"
      @submit="handleRegister"
    >
      <template v-slot:extra-fields>
        <div class="form-group">
          <label>Nome</label>
          <input v-model="registerForm.name" type="text" required />
        </div>
      </template>
    </AuthForm>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import AuthForm from '../components/AuthForm.vue';

export default {
  name: 'RegisterView',
  components: {
    AuthForm,
  },
  data() {
    return {
      errorMessage: '',
      successMessage: '',
      registerForm: { // Dados adicionais do registro
        name: '',
      }
    };
  },
  methods: {
    async handleRegister(formData) {
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const payload = {
          email: formData.email,
          password: formData.password,
          name: this.registerForm.name, // Inclui o campo extra do registro
        };

        const response = await axios.post('/api/auth/register', payload);

        this.successMessage = response.data.message || 'Cadastro realizado com sucesso! Faça login agora.';
        console.log('Registro bem-sucedido:', response.data);

        this.$router.push('/login'); // Redireciona para a página de login após o registro
      } catch (error) {
        console.error('Erro no registro:', error);
        if (error.response) {
          this.errorMessage = error.response.data.message || 'Erro ao cadastrar. Tente novamente.';
        } else {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        }
      }
    },
  },
};
</script>

<style scoped>
/* Estilos semelhantes ao login-container, mas ajuste se necessário */
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  background-color: #f0f2f5;
  padding: 20px;
}
.error-message, .success-message {
    margin-top: 20px;
    padding: 10px 15px;
    border-radius: 8px;
    text-align: center;
    font-size: 0.9rem;
}
.error-message {
    color: #d32f2f;
    background-color: #ffebee;
    border: 1px solid #ef9a9a;
}
.success-message {
    color: #388e3c;
    background-color: #e8f5e9;
    border: 1px solid #a5d6a7;
}
</style>