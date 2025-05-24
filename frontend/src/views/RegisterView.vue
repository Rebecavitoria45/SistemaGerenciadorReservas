<template>
    <AuthForm
      title="Criar Conta"
      buttonText="Cadastrar"
      showForgot="false"
      altText="Já tem conta? Faça login"
      altLink="/login"
      :onSubmit="handleRegister"
    >
      <template #extra-fields>
        <div class="form-group">
          <label>Nome</label>
          <input v-model="name" required />
        </div>
      </template>
    </AuthForm>
  </template>
  
  <script>
  import AuthForm from '@/components/AuthForm.vue';
  
  export default {
    components: { AuthForm },
    data() {
      return {
        name: '',
      };
    },
    methods: {
      async handleRegister({ email, password }) {
        console.log('Cadastro de:', this.name, email);
        alert('Cadastro realizado com sucesso!');
        this.$router.push('/login');
      },
    },
  };
  </script>
  