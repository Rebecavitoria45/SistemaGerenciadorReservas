import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      if (token && role) {
        if (role === 'admin') return '/home';    // Página inicial admin
        if (role === 'user') return '/homeuser'; // Página inicial user
      }
      return '/login';  // Se não autenticado, vai para login
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin']
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'user']
    }
  },

  // ADMIN
  {
    path: '/reservas',
    name: 'Reservas',
    component: () => import('@/views/ReservasView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin']
    }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('@/views/UsuariosView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin']
    }
  },
  {
    path: '/quartos',
    name: 'Quartos',
    component: () => import('@/views/QuartosView.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin']
    }
  },

  // USER
  {
    path: '/homeuser',
    name: 'HomeUser',
    component: () => import('@/views/HomeUser.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user']
    }
  },
  {
    path: '/viewroom',
    name: 'ViewRoom',
    component: () => import('@/views/ViewRoom.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user']
    }
  },
  {
    path: '/minhasReservas',
    name: 'MinhasReservas',
    component: () => import('@/views/MinhasReservas.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
    }
  },

  {
    path: '/not-authorized',
    name: 'NotAuthorized',
    component: () => import('@/views/NaoAutorizado.vue'),
    meta: { requiresAuth: false }
  },

  // Fallback 404
  {
    path: '/:catchAll(.*)',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const isAuthenticated = !!token;

  const publicPages = ['Login', 'Register', 'ForgotPassword', 'NotAuthorized'];

  console.log('Rota:', to.fullPath);
  console.log('Token:', token);
  console.log('Role:', userRole);
  console.log('Meta:', to.meta);

  if (!isAuthenticated && !publicPages.includes(to.name)) {
    console.warn('Não autenticado. Redirecionando para login.');
    return next({ name: 'Login' });
  }

  if (isAuthenticated && ['Login', 'Register'].includes(to.name)) {
    return next(userRole === 'admin' ? '/home' : '/homeuser');
  }

  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    console.warn(' Sem permissão para acessar esta rota.');
    return next({ name: 'NotAuthorized' });
  }

  return next();
});

export default router;
