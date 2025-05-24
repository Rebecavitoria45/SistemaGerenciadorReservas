<template>
  <AuthForm
    title="Login no Sistema"
    buttonText="Entrar"
    showForgot
    altText="Não tem conta? Cadastre-se"
    altLink="/register"
    :onSubmit="handleLogin"
  />
</template>

<script>
import AuthForm from '@/components/AuthForm.vue';

export default {
  components: { AuthForm },
  methods: {
    async handleLogin({ email, password }) {
      // Simulação de login
      if (email === 'admin@teste.com' && password === '123456') {
        alert('Login bem-sucedido!');
        this.$router.push('/');
      } else {
        alert('Credenciais inválidas!');
      }
    },
  },
};
</script>
