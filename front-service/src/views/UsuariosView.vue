<template>
  <div class="usuarios-page">
    <div class="header-usuario">
  <h2>Gerenciamento de Usuarios</h2>
  </div>
    <p v-if="loading">Carregando usuários...</p>
    <p v-if="error" class="error-message">Erro: {{ error }}</p>

    <div v-if="usuarios && usuarios.length" class="usuarios-grid">
      <UsuarioCard
        v-for="usuario in usuarios"
        :key="usuario.usuario_id" :usuario="usuario"
        @click="handleOpenEditModal(usuario.usuario_id)" />
    </div>
    <p v-else-if="!loading && !error && (!usuarios || usuarios.length === 0)" class="no-users-message">Nenhum usuário encontrado.</p>

    <UsuarioModal
      :is-visible="isModalOpen"
      :user-to-edit="selectedUsuario" @close="closeModal"
      />
  </div>
</template>

<script>
import UsuarioCard from '@/components/UsuarioCard.vue';
import UsuarioModal from '../components/modals/ModalUser.vue'; 
import { userApi, roomsApi, reservationApi } from '../utils/axios';



export default {
  name: 'UsuariosPage',
  components: {
    UsuarioCard,
    UsuarioModal,
  },
  data() {
    return {
      usuarios: [],
      loading: true,
      error: null,
      isModalOpen: false,
      selectedUsuario: null, 
    };
  },
  async created() {
    await this.fetchUsuarios();
  },
  methods: {
    async fetchUsuarios() {
      try {
        this.loading = true;
        this.error = null;

        const response = await userApi.get('/listar'); 

        if (Array.isArray(response.data)) {
          this.usuarios = response.data;
          console.log("Usuários carregados:", this.usuarios);
        } else {
          this.error = "Erro no formato dos dados da API. Esperado um array de usuários.";
          console.error("Formato inesperado da API:", response.data);
        }
      } catch (err) {
        if (err.response) {
          this.error = `Erro do servidor: ${err.response.status} - ${err.response.data?.message || err.response.data?.error || 'Erro desconhecido do servidor.'}`;
        } else if (err.request) {
          this.error = 'Erro de rede: servidor não está respondendo. Verifique se o backend está rodando na porta 3004.';
        } else {
          this.error = 'Erro inesperado ao configurar a requisição.';
        }
        console.error("Erro ao buscar usuários:", err);
      } finally {
        this.loading = false;
      }
    },

    handleOpenEditModal(usuarioId) {
  console.log('ID do usuário clicado:', usuarioId); 
  this.selectedUsuario = this.usuarios.find(u => u.usuario_id === usuarioId);
  if (this.selectedUsuario) {
    console.log('Usuário selecionado para edição:', this.selectedUsuario); 
    this.isModalOpen = true;
  } else {
    alert('Usuário não encontrado para edição. Verifique o console.');
    console.error('ID do usuário não encontrado na lista:', usuarioId);
  }
},
    closeModal() {
      this.isModalOpen = false;
      this.selectedUsuario = null; 
      this.fetchUsuarios(); 
    },

  },
};
</script>

<style scoped>
.usuarios-page {
  padding: 20px;
  max-width: 1900px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.usuarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  justify-content: center;
  align-items: start;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
}

.no-users-message {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.header-usuario {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}
</style>