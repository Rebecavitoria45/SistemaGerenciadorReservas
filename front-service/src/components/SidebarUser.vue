<template>
  <div class="sidebar-container" :class="{ open: isOpen }">
    <div class="sidebar-header">
      <div class="logo-wrapper">
        <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
      </div>
      <button type="button" class="btn-close" @click="closeSidebar">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="sidebar-body">
      <ul class="nav flex-column">
        <li class="nav-item" v-for="(item, index) in menuItems" :key="index">
          <router-link
            :to="item.path"
            class="nav-link"
            active-class="active"
            exact @click="closeSidebar"
          >
            <i :class="item.icon" class="me-2"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="sidebar-footer">
      <hr class="footer-divider" />
      <div class="user-info">
        <div class="user-avatar">
          <i class="bi bi-person-fill"></i>
        </div>
        <div class="user-details">
          <span class="user-name">User</span>
          <span class="user-role">usuario</span>
        </div>
      </div>
      <a href="#" class="logout-link" @click.prevent="handleLogout">
        <i class="bi bi-box-arrow-left me-2"></i> Log Out
      </a>
    </div>
  </div>

  <button v-if="!isOpen" class="btn open-sidebar-btn" @click="openSidebar">
    <i class="bi bi-list"></i>
  </button>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Sidebar',
  setup() {
    const isOpen = ref(false);
    const router = useRouter();

    const menuItems = [
      { label: 'Home', icon: 'bi bi-door-closed-fill', path: '/HomeUser' },
      { label: 'Quartos', icon: 'bi bi-door-closed-fill', path: '/ViewRoom' },
      { label: 'Minhas Reservas', icon: 'bi bi-calendar-check-fill', path: '/MinhasReservas' },
      { label: 'Sobre', icon: 'bi bi-info-square-fill', path: '/about' },
    ];

    const openSidebar = () => {
      isOpen.value = true;
    };
    const closeSidebar = () => {
      isOpen.value = false;
    };

    const handleNavigationClick = () => {
      setTimeout(() => {
        closeSidebar();
      }, 200);
    };

    const handleLogout = () => {
      try {
        console.log('Logout realizado no frontend.');

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('usuario_id');

        router.push('/login');
        closeSidebar();
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('usuario_id');
        router.push('/login');
      }
    };

    return { isOpen, openSidebar, closeSidebar, handleNavigationClick, menuItems, handleLogout };
  },
};
</script>


  <style scoped>
  .sidebar-container {
    position: fixed;
    top: 0;
    left: -240px;
    width: 240px;
    height: 100%;
    background-color: #fff;
    border-right: 1px solid #ddd;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    z-index: 1050;
    transition: left 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-container.open {
    left: 0;
  }
  
  .sidebar-header {
    padding: 1.5rem 1.5rem 1rem; 
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo-wrapper {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }
  
  .logo-img {
    width: 50px; 
    height: auto;
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 1.5rem; 
    color: #6c757d; 
    cursor: pointer;
    transition: color 0.2s ease;
  }
  
  .btn-close:hover {
    color: #343a40; 
  }
  
  
  .sidebar-body {
    flex-grow: 1;
    overflow-y: auto;
    padding-top: 1rem; 
  }
  
  .nav-link {
    padding: 1rem 1.5rem; 
    color: #333; 
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: background-color 0.2s, color 0.2s, font-weight 0.2s;
    font-size: 1rem; 
    font-family: 'Inter', sans-serif; 
    font-weight: 400; 
  }
  
  .nav-link:hover {
    background-color: #e9ecef;
    font-weight: 600; 
    color: #007bff; 
  }
  
  .nav-link.active {
    background-color: #e0e0e0; 
    font-weight: 700; 
    color: #007bff;
  }
  
  .nav-link i { 
      margin-right: 10px;
      font-size: 1.1rem;
  }
  
  
  .sidebar-footer {
    padding: 1.5rem; 
    border-top: 1px solid #eee;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: 'Inter', sans-serif; 
  }
  
  .footer-divider {
    width: 100%;
    margin-bottom: 1rem; 
  }
  
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .user-avatar {
    width: 35px; 
    height: 35px; 
    background-color: #ccc;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.75rem; 
    font-size: 1.1rem; 
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
  }
  
  .user-name {
    font-size: 0.9rem; 
    font-weight: 600;
    color: #333;
  }
  
  .user-role {
    font-size: 0.8rem;
    color: #888;
  }
  
  .logout-link {
    font-size: 0.9rem; 
    color: #888;
    text-decoration: none;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 0; 
    border-radius: 4px;
    transition: background-color 0.2s, color 0.2s;
  }
  
  .logout-link:hover {
    color: #dc3545; 
    background-color: #ffebeb;
  }
  
  .open-sidebar-btn {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1051;
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 0.6rem 0.9rem; 
    border-radius: 0.375rem;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .open-sidebar-btn:hover {
    background-color: #5a6268; 
  }
  </style>