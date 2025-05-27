<template>
  <div class="usuarios-page">
    <h2>Gerenciamento de Usuários</h2>

    <p v-if="loading">Carregando usuários...</p>
    <p v-if="error" class="error-message">Erro: {{ error }}</p>

    <div v-if="usuarios && usuarios.length" class="usuarios-grid">
      <UsuarioCard
        v-for="usuario in usuarios"
        :key="usuario.usuario_id"
        :usuario="usuario"
        @open-popup="handleOpenPopup"
      />
    </div>
    <p v-else-if="!loading && !error && (!usuarios || usuarios.length === 0)" class="no-users-message">Nenhum usuário encontrado.</p>
  </div>
</template>

<script>
import UsuarioCard from '@/components/UsuarioCard.vue';
import axios from 'axios'; 
export default {
  name: 'UsuariosPage',
  components: {
    UsuarioCard,
  },
  data() {
    return {
      usuarios: [], 
      loading: true,
      error: null,
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

        
        console.log("Tentando buscar usuários..."); 
        const response = await axios.get('http://localhost:3004/listar');
        
        console.log("Dados recebidos da API:", response.data); 
        
        if (Array.isArray(response.data)) {
            this.usuarios = response.data;
        } else {
            console.error("Formato inesperado da API. Esperado um array, recebido:", response.data);
            this.error = "Erro no formato dos dados da API.";
        }

      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        if (err.response) {
          this.error = `Erro do servidor: ${err.response.status} - ${err.response.data?.message || 'Erro desconhecido do servidor.'}`;
          console.error("Detalhes da resposta de erro:", err.response.data);
        } else if (err.request) {
          this.error = 'Erro de rede: O servidor de usuários não está respondendo. Verifique se ele está online e a URL do backend está correta.';
          console.error("Nenhuma resposta recebida do servidor:", err.request);
        } else {
          this.error = 'Ocorreu um erro inesperado ao configurar a requisição.';
          console.error("Erro na requisição Axios:", err.message);
        }
      } finally {
        this.loading = false;
      }
    },
    handleOpenPopup(userId) {
      console.log(`Você clicou para abrir o popup do usuário com ID: ${userId}`);
    },
  },
};
</script>

<style scoped>
.usuarios-page {
  padding: 20px;
  max-width: 1200px;
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
</style>