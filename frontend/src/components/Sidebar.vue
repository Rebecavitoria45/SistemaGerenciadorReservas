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
            exact
            @click="handleNavigationClick"
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
          <span class="user-name">Clodoaldo</span>
          <span class="user-role">Admin</span>
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
import axios from 'axios'; // Importe o Axios

export default {
  name: 'Sidebar',
  setup() {
    const isOpen = ref(false);
    const router = useRouter();

    const menuItems = [
      { label: 'Dashboard', icon: 'bi bi-grid-fill', path: '/' },
      { label: 'Quartos', icon: 'bi bi-door-closed-fill', path: '/quartos' },
      { label: 'Reservas', icon: 'bi bi-calendar-check-fill', path: '/reservas' },
      { label: 'Usuários', icon: 'bi bi-people-fill', path: '/usuarios' },
      { label: 'Sobre', icon: 'bi bi-info-square-fill', path: '/about' },
    ];

    const openSidebar = () => { isOpen.value = true; };
    const closeSidebar = () => { isOpen.value = false; };

    const handleNavigationClick = (event) => {
      setTimeout(() => {
        closeSidebar();
      }, 200); 
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      event.currentTarget.classList.add('active');
    };

    // --- Nova Função de Logout ---
    const handleLogout = async () => {
      try {
     
        console.log('Logout realizado no frontend.');

        localStorage.removeItem('userToken');
       
        router.push('/login');
        
        closeSidebar();

      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        localStorage.removeItem('userToken');
        router.push('/login');
      }
    };

    return { isOpen, openSidebar, closeSidebar, handleNavigationClick, menuItems, handleLogout };
  }
};
</script>


<style scoped>
/* Seus estilos CSS permanecem os mesmos */
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
  padding: 1rem 1rem 0.5rem;
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
  width: 40px;
  height: auto;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #333;
  cursor: pointer;
}

.sidebar-body {
  flex-grow: 1;
  overflow-y: auto;
}

.nav-link {
  padding: 0.75rem 1rem;
  color: #333;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 0.9rem;
}

.nav-link:hover,
.nav-link.active {
  background-color: #f0f0f0;
  font-weight: bold;
  color: #000;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-divider {
  width: 100%;
  margin-bottom: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.user-avatar {
  width: 30px;
  height: 30px;
  background-color: #ccc;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.5rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.8rem;
  font-weight: bold;
}

.user-role {
  font-size: 0.7rem;
  color: #888;
}

.logout-link {
  font-size: 0.75rem;
  color: #888;
  text-decoration: none;
  display: flex;
  align-items: center;
  /* Adicionado para que o link de logout ocupe a largura do footer */
  width: 100%;
  padding: 0.5rem 0;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.logout-link:hover {
  color: #000;
  background-color: #f0f0f0;
}

.open-sidebar-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1051;
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>