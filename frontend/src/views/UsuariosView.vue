<template>
  <div class="usuarios-container">
    <h1>Gerenciamento de Usuários</h1>

    <div v-if="loading" class="loading-message">Carregando usuários...</div>
    <div v-else-if="error" class="error-message">
      Ocorreu um erro ao carregar os usuários: {{ error.message }}
    </div>
    <div v-else-if="usuarios.length === 0" class="no-users">Nenhum usuário encontrado.</div>
    <div v-else class="user-cards-grid">
      <UserCard
        v-for="usuario in usuariosPaginados"
        :key="usuario.id"
        :user="usuario"
        @open-popup="handleOpenUserPopup"
      />
    </div>

    <div v-if="usuarios.length > 0 && totalPaginas > 1" class="paginacao">
      <button @click="paginaAnterior" :disabled="paginaAtual === 1">Anterior</button>
      <span>Página {{ paginaAtual }} de {{ totalPaginas }}</span>
      <button @click="proximaPagina" :disabled="paginaAtual === totalPaginas">Próxima</button>
    </div>

    <div v-if="showUserPopup" class="user-popup-overlay" @click.self="closeUserPopup">
      <div class="user-popup-content">
        <h2>Detalhes do Usuário</h2>
        <p v-if="selectedUser">
          <strong>Nome:</strong> {{ selectedUser.nome }}<br>
          <strong>Email:</strong> {{ selectedUser.email }}<br>
          <strong>Telefone:</strong> {{ selectedUser.telefone || 'N/A' }}<br>
          <strong>Tipo:</strong> {{ selectedUser.tipo }}<br>
          <strong>Status:</strong> <span :class="getUserStatusClass(selectedUser.status)">{{ selectedUser.status }}</span>
        </p>
        <button @click="closeUserPopup">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UserCard from '../components/UsuarioCard.vue'; 

export default {
  name: 'UsuariosView', 
  components: {
    UserCard,
  },
  data() {
    return {
      paginaAtual: 1,
      porPagina: 6,
      usuarios: [],
      loading: false,
      error: null,
      showUserPopup: false,
      selectedUserId: null,
      selectedUser: null, 
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.usuarios.length / this.porPagina);
    },
    usuariosPaginados() {
      const start = (this.paginaAtual - 1) * this.porPagina;
      const end = start + this.porPagina;
      return this.usuarios.slice(start, end);
    },
  },
  methods: {
    async fetchUsuarios() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3004/usuarios');
        this.usuarios = response.data;
        this.paginaAtual = 1;
      } catch (err) {
        this.error = err;
        console.error("Erro ao buscar usuários:", err);
      } finally {
        this.loading = false;
      }
    },
    paginaAnterior() {
      if (this.paginaAtual > 1) {
        this.paginaAtual--;
      }
    },
    proximaPagina() {
      if (this.paginaAtual < this.totalPaginas) {
        this.paginaAtual++;
      }
    },
    handleOpenUserPopup(userId) {
      this.selectedUserId = userId;
      
      this.selectedUser = this.usuarios.find(user => user.id === userId);
      this.showUserPopup = true;
    },
    closeUserPopup() {
      this.showUserPopup = false;
      this.selectedUserId = null;
      this.selectedUser = null;
    },
    getUserStatusClass(status) {
      if (status === 'ativo') {
        return 'status-active';
      } else if (status === 'inativo') {
        return 'status-inactive';
      }
      return '';
    }
  },
  created() {
    this.fetchUsuarios();
  },
};
</script>

<style scoped>
.usuarios-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 2.5em;
  font-weight: 700;
}

.loading-message, .error-message, .no-users {
  text-align: center;
  font-size: 1.2em;
  color: #666;
  padding: 30px;
  border-radius: 8px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
}

.error-message {
  color: #d9534f;
  background-color: #fcecec;
  border-color: #ebccd1;
}

.user-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  justify-content: center; 
  align-items: flex-start; 
}



.paginacao {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.paginacao button {
  padding: 0.7rem 1.4rem;
  background-color: #007bff; 
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.paginacao button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}
.paginacao button:not(:disabled):hover {
  background-color: #0056b3; 
}

.paginacao span {
  font-size: 1.1em;
  color: #555;
}

.user-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.user-popup-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.user-popup-content h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.user-popup-content p {
  text-align: left;
  margin-bottom: 10px;
  font-size: 1.1em;
  color: #444;
}

.user-popup-content p strong {
  color: #007bff;
}

.user-popup-content button {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.user-popup-content button:hover {
  background-color: #5a6268;
}

.status-active {
  color: #28a745;
  font-weight: bold;
}

.status-inactive {
  color: #dc3545;
  font-weight: bold;
}


@media (max-width: 768px) {
  .user-cards-grid { /* Ajuste para o grid */
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.2rem;
  }
  h1 {
    font-size: 2em;
  }
}

@media (max-width: 480px) {
  .user-cards-grid { /* Ajuste para o grid */
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  h1 {
    font-size: 1.8em;
  }
  .paginacao {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>