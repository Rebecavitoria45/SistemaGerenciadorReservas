<template>
    <AuthForm
      title="Recuperar Senha"
      buttonText="Enviar link de recuperação"
      showPassword="false"
      altText="Voltar ao login"
      altLink="/login"
      :onSubmit="handleRecovery"
    />
  </template>
  
  <script>
  import AuthForm from '@/components/AuthForm.vue';
  
  export default {
    components: { AuthForm },
    methods: {
      async handleRecovery({ email }) {
        alert(`Se existir uma conta com o e-mail ${email}, enviaremos instruções para recuperar sua senha.`);
        this.$router.push('/login');
      },
    },
  };
  </script>
  