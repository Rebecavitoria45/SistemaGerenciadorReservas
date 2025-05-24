<template>
    <form @submit.prevent="onSubmit">
      <h2>{{ title }}</h2>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>
  
      <div class="form-group" v-if="showPassword">
        <label>Senha</label>
        <input v-model="form.password" type="password" required />
      </div>
  
      <slot name="extra-fields" />
  
      <button type="submit">{{ buttonText }}</button>
      <p v-if="showForgot" class="link"><router-link to="/forgot-password">Esqueci minha senha</router-link></p>
      <p class="link">
        <router-link :to="altLink">{{ altText }}</router-link>
      </p>
    </form>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      buttonText: String,
      showPassword: { type: Boolean, default: true },
      showForgot: { type: Boolean, default: false },
      altText: String,
      altLink: String,
      onSubmit: Function,
    },
    data() {
      return {
        form: {
          email: '',
          password: '',
        },
      };
    },
    methods: {
      async submitForm() {
        if (this.onSubmit) await this.onSubmit(this.form);
      },
    },
  };
  </script>
  
  <style scoped>
  form {
    max-width: 400px;
    margin: auto;
    padding: 2rem;
    border-radius: 12px;
    background: #f8f8f8;
    box-shadow: 0 0 10px #ccc;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  input {
    width: 100%;
    padding: 0.5rem;
  }
  button {
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .link {
    margin-top: 1rem;
    text-align: center;
  }
  </style>
  