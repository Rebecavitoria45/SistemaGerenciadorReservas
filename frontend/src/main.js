import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

// 1. Crie a instância do app primeiro.
const app = createApp(App);

// 2. Configure o Axios ( baseURL)
axios.defaults.baseURL = 'http://localhost:3004';

// 3. Torne o Axios acessível globalmente usando a instância `app`.
app.config.globalProperties.$axios = axios;

// 4. Use os plugins/rotas
app.use(router);

// 5. Monte o aplicativo
app.mount('#app');