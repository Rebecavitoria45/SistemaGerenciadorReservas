<template>
  <div id="app">
    <Sidebar :expanded="sidebarExpanded" v-if="!isAuthPage" />

    <div
      class="main-content"
      :class="{
        'auth-layout': isAuthPage,
        expanded: sidebarExpanded,
        collapsed: !sidebarExpanded,
      }"
    >
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
import Sidebar from './components/Sidebar.vue'
import NavbarSuperior from './components/NavbarSuperior.vue'

export default {
  name: 'App',
  components: { Sidebar, NavbarSuperior },
  data() {
    return {
      sidebarExpanded: false,
    }
  },
  computed: {
    isAuthPage() {
      return ['Login', 'ForgotPassword', 'Register'].includes(this.$route.name)
    },
  },
  methods: {
    toggleSidebar() {
      this.sidebarExpanded = !this.sidebarExpanded
    },
  },
}
</script>

<style>
#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  height: 100vh;
  padding: 1rem;
}

.main-content.expanded {
  margin-left: 250px;
}

.main-content.collapsed {
  margin-left: 80px;
}

.main-content.auth-layout {
  margin-left: 0 !important;
  justify-content: center;
  align-items: center;
  padding: 0;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
