<template>
  <form @submit.prevent="submitForm" class="auth-form-container">
    <h2>{{ title }}</h2>

    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" v-model="localForm.email" type="email" required autocomplete="username" />
    </div>

    <div class="form-group" v-if="showPassword">
      <label for="password">Senha</label>
      <input id="password" v-model="localForm.password" type="password" required autocomplete="current-password" />
    </div>

    <slot name="extra-fields" />

    <button type="submit" class="submit-button">{{ buttonText }}</button>

    <p v-if="showForgot" class="link">
      <router-link to="/forgot-password">Esqueci minha senha</router-link>
    </p>
    <p class="link">
      <router-link :to="altLink">{{ altText }}</router-link>
    </p>
  </form>
</template>

<script>
export default {
  name: 'AuthForm',
  props: {
    title: { type: String, required: true },
    buttonText: { type: String, default: 'Enviar' },
    showPassword: { type: Boolean, default: true },
    showForgot: { type: Boolean, default: false },
    altText: { type: String, required: true },
    altLink: { type: String, required: true },
  },
  data() {
    return {
      localForm: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
  submitForm() {
    this.$emit('submit', { ...this.localForm }); 
  },
},
};
</script>

<style scoped>
.auth-form-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  border-radius: 12px;
  background: #ffffff; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.25rem; 
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem; 
  font-weight: 600;
}

.form-group {
  margin-bottom: 0.75rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.8rem 1rem; 
  border: 1px solid #ccc;
  border-radius: 8px; 
  box-sizing: border-box; 
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #007bff; /* Cor de foco */
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); 
  outline: none; 
}

.submit-button {
  width: 100%; 
  padding: 0.9rem 1.5rem; 
  background-color: #007bff; 
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
}

.submit-button:hover {
  background-color: #0056b3; 
  transform: translateY(-1px); 
}

.submit-button:active {
  transform: translateY(0);
}

.link {
  margin-top: 0.5rem; 
  text-align: center;
  font-size: 0.9rem;
}

.link a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.link a:hover {
  color: #0056b3;
  text-decoration: underline;
}
</style>