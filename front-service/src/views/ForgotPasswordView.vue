<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Esqueceu sua senha?</h2>
      <p class="text-info">Digite seu email e enviaremos um link para redefinir sua senha.</p>
      <form @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Enviando...' : 'Enviar Link' }}
        </button>
        <p v-if="message" :class="{'success-message': !error, 'error-message': error}">{{ message }}</p>
      </form>
      <div class="auth-links">
        <router-link to="/login">Voltar para o Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordView',
  data() {
    return {
      email: '',
      loading: false,
      message: null,
      error: false,
    };
  },
  methods: {
    async handleForgotPassword() {
      this.loading = true;
      this.message = null;
      this.error = false;

      setTimeout(() => {
        if (this.email.includes('@')) {
          this.message = 'Se um email com ' + this.email + ' for encontrado, um link de redefinição foi enviado.';
          this.error = false;
          this.email = '';
        } else {
          this.message = 'Por favor, insira um email válido.';
          this.error = true;
        }
        this.loading = false;
      }, 2000);
    },
  },
};
</script>

<style scoped>

html, body {
  margin: 0;
  padding: 0;
  height: 100%; 
  width: 100%;  
  overflow-x: hidden;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale;
  background-image: url('../assets/back.jpeg'); 
  background-size: cover; 
  background-position: center center; 
  background-repeat: no-repeat; 
  background-attachment: fixed; 
}

.auth-container {
  display: flex;
  justify-content: center; 
  align-items: center;    
  min-height: 100vh;    
  width: 100vw;            
  box-sizing: border-box; 
  padding: 20px; 
}

.auth-card {
  background-color: #ffffff; 
  padding: 40px 30px; 
  border-radius: 12px; 
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); 
  width: 100%; 
  max-width: 420px;
  text-align: center;
}

.auth-card h2 {
  margin-bottom: 30px; 
  color: #333333; 
  font-size: 2rem; 
  font-weight: 600; 
}

.form-group {
  margin-bottom: 20px; 
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 10px; 
  color: #555555; 
  font-weight: 500;
  font-size: 0.95rem; 
}

.form-control {
  width: 100%; 
  padding: 14px 15px; 
  border: 1px solid #cccccc; 
  border-radius: 8px; 
  font-size: 1.05rem; 
  color: #333333; 
  box-sizing: border-box; 
  transition: border-color 0.2s ease, box-shadow 0.2s ease; 
}

.form-control:focus {
  border-color: #007bff; 
  outline: none; 
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2); 
}

.btn-primary {
  width: 100%; 
  padding: 15px 20px; 
  background-color: #007bff;
  color: #ffffff; 
  border: none; 
  border-radius: 8px;
  font-size: 1.15rem; 
  font-weight: 600; 
  cursor: pointer; 
  transition: background-color 0.3s ease, transform 0.2s ease; 
  margin-top: 25px; 
}

.btn-primary:hover {
  background-color: #0056b3; 
  transform: translateY(-2px); 
}

.btn-primary:active {
  background-color: #004085; 
  transform: translateY(0); 
}

.btn-primary:disabled {
  background-color: #a0c9f1; 
  cursor: not-allowed;
  transform: none; 
}
.error-message {
  color: #dc3545; 
  margin-top: 15px; 
  font-size: 0.9rem;
  text-align: center; 
}

.auth-links {
  margin-top: 30px; 
  font-size: 0.95rem; 
}

.auth-links a {
  color: #007bff; 
  text-decoration: none; 
  display: block; 
  margin-bottom: 10px; 
  transition: text-decoration 0.2s ease; 
}

.auth-links a:hover {
  text-decoration: underline;
}

</style>