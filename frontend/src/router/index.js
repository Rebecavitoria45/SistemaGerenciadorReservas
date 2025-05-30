import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },{
     path: '/register',
     name: 'Register',
     component: () => import('@/views/RegisterView.vue') 
    },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPasswordView.vue')
  },
  {
    path: '/quartos',
    name: 'Quartos',
    component: () => import('@/views/QuartosView.vue')
  },
  {
    path: '/reservas',
    name: 'Reservas',
    component: () => import('@/views/ReservasView.vue')
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('@/views/UsuariosView.vue')
  },  
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue') 
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue') 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;