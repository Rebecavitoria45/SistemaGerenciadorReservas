import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const app = createApp(App);

axios.defaults.baseURL = 'http://localhost:3000';

app.config.globalProperties.$axios = axios;

app.use(router);

app.mount('#app');
