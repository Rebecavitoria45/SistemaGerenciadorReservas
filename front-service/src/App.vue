<template>
  <div id="app">
    <!-- Sidebar Admin -->
    <Sidebar
      v-if="!isAuthPage && role === 'admin'"
      :expanded="sidebarExpanded"
    />

    <!-- Sidebar Usuário -->
    <SidebarUser
      v-if="!isAuthPage && role === 'user'"
      :expanded="sidebarExpanded"
    />

    <div
      class="main-content"
      :class="{
        'auth-layout': isAuthPage,
        expanded: sidebarExpanded,
        collapsed: !sidebarExpanded,
      }"
    >
      <!-- Navbar aparece para ambos -->
      <NavbarSuperior
        v-if="!isAuthPage"
        :expanded="sidebarExpanded"
        @toggle-sidebar="toggleSidebar"
      />

      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import SidebarUser from './components/SidebarUser.vue';
import NavbarSuperior from './components/NavbarSuperior.vue';

export default {
  name: 'App',
  components: {
    Sidebar,
    SidebarUser,
    NavbarSuperior,
  },
  data() {
    return {
      sidebarExpanded: false,
      role: localStorage.getItem('role'), // mantém atualizado
    };
  },
  computed: {
    isAuthPage() {
      // Rotas que devem ter layout limpo (sem menu, navbar)
      return ['Login', 'ForgotPassword', 'Register', 'NotAuthorized'].includes(this.$route.name);
    },
  },
  watch: {
    // Atualiza role sempre que mudar de rota
    '$route'() {
      this.role = localStorage.getItem('role');
    },
  },
  methods: {
    toggleSidebar() {
      this.sidebarExpanded = !this.sidebarExpanded;
    },
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f2f5; 
  overflow: hidden;
}

#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden; 
}

.main-content {
  flex: 1; 
  box-sizing: border-box;
  transition: margin-left 0.3s ease;
  overflow-y: auto; 
  height: 100vh; 
  padding: 20px;
}

.main-content.expanded {
  margin-left: 250px;
}

.main-content.collapsed {
  margin-left: 80px;
}

.main-content.auth-layout {
  margin-left: 0 !important; 
  width: 100vw; 
  height: 100vh; 
  display: flex;
  justify-content: center; 
  align-items: center; 
  padding: 0; 
  background-color: transparent; 
}
</style>
