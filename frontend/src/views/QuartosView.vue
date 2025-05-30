<template>
  <div class="quartos-page">
    <div class="header-quarto">
  <h2>Gerenciamento de Quartos</h2>
  <button @click="openCreateModal" class="button-add-quarto">
    Adicionar Novo Quarto
  </button>
</div>




    <p v-if="loading">Carregando quartos...</p>
    <p v-if="error" class="error-message">Erro: {{ error }}</p>

    <div v-if="quartos && quartos.length" class="quartos-grid">
      <QuartoCard
        v-for="quarto in quartosPaginados"
        :key="quarto.numero_quarto"
        :quarto="quarto"
        @open-popup="handleOpenEditModal" />
    </div>
    <p v-else-if="!loading && !error && (!quartos || quartos.length === 0)" class="no-rooms-message">
      Nenhum quarto encontrado.
    </p>

    <div v-if="quartos.length > itemsPerPage" class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Próxima</button>
    </div>

    <QuartoModal
      :is-visible="isModalOpen"
      :quarto-to-edit="selectedQuarto"
      @close="closeModal"
      @createQuarto="handleCreateQuarto"
      @updateQuarto="handleUpdateQuarto"
      @deleteQuarto="handleDeleteQuarto"
    />
  </div>
</template>

<script>
import QuartoCard from '@/components/quartoCard.vue'; 
import QuartoModal from '@/components/modals/ModalQuarto.vue'; 
import axios from 'axios';

const apiQuartos = axios.create({
  baseURL: 'http://localhost:3002', 
});

export default {
  name: 'QuartosPage',
  components: {
    QuartoCard,
    QuartoModal,
  },
  data() {
    return {
      quartos: [],
      loading: true,
      error: null,
      isModalOpen: false,
      selectedQuarto: null,
      currentPage: 1,
      itemsPerPage: 6,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.quartos.length / this.itemsPerPage);
    },
    quartosPaginados() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.quartos.slice(start, end);
    },
  },
  async created() {
    await this.fetchQuartos();
  },
  methods: {
    async fetchQuartos() {
      try {
        this.loading = true;
        this.error = null;

        const timestamp = new Date().getTime(); 
        const response = await apiQuartos.get(`/listar?_=${timestamp}`); 

        if (Array.isArray(response.data)) {
          this.quartos = response.data;
          console.log("Quartos carregados:", this.quartos);
        } else {
          this.error = "Erro no formato dos dados da API de quartos. Esperado um array.";
          console.error("Formato inesperado da API:", response.data);
        }

      } catch (err) {
        if (err.response) {
          this.error = `Erro do servidor: ${err.response.status} - ${err.response.data?.message || err.response.data?.error || 'Erro desconhecido do servidor.'}`;
        } else if (err.request) {
          this.error = 'Erro de rede: O servidor de quartos não está respondendo. Verifique se o backend está rodando na porta 3002.';
        } else {
          this.error = 'Ocorreu um erro inesperado ao configurar a requisição.';
        }
        console.error("Erro ao buscar quartos:", err);
      } finally {
        this.loading = false;
      }
    },
    openCreateModal() {
      this.selectedQuarto = null; 
      this.isModalOpen = true;
    },
    handleOpenEditModal(numero_quarto) {
      this.selectedQuarto = this.quartos.find(q => q.numero_quarto === numero_quarto);
      if (this.selectedQuarto) {
        this.isModalOpen = true;
      } else {
        alert('Quarto não encontrado para edição.');
        console.error('Número do quarto não encontrado na lista:', numero_quarto);
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedQuarto = null;
      this.fetchQuartos(); 
    },
    async handleCreateQuarto(newQuartoData) {
      try {
        await apiQuartos.post('/cadastrar', newQuartoData);
        alert('Quarto criado com sucesso!');
        this.fetchQuartos(); 
      } catch (err) {
        console.error('Erro ao criar quarto:', err.response ? err.response.data : err.message);
        alert('Erro ao criar quarto. Verifique o console.');
      }
    },
    async handleUpdateQuarto(updatedQuartoData) {
      try {
        await apiQuartos.put(`/atualizar/${updatedQuartoData.numero_quarto}`, updatedQuartoData); 
        alert('Quarto atualizado com sucesso!');
        this.fetchQuartos(); 
      } catch (err) {
        console.error('Erro ao atualizar quarto:', err.response ? err.response.data : err.message);
        alert('Erro ao atualizar quarto. Verifique o console.');
      }
    },
    async handleDeleteQuarto(quartoNumber) {
      try {
        await apiQuartos.delete(`/deletar/${quartoNumber}`); 
        alert('Quarto deletado com sucesso!');
        this.fetchQuartos(); 
      } catch (err) {
        console.error('Erro ao deletar quarto:', err.response ? err.response.data : err.message);
        alert('Erro ao deletar quarto. Verifique o console.');
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  },
};
</script>

<style scoped>
.quartos-page {
  padding: 20px;
  max-width: 1900px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.button-add-item {
  display: block;
  margin: 0 auto 30px auto;
  padding: 12px 25px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}
.button-add-item:hover {
  background-color: #218838;
}

.quartos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
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

.no-rooms-message {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 10px;
}
.pagination-controls button {
  padding: 8px 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.pagination-controls button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.pagination-controls span {
  font-weight: bold;
}
.header-quarto {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}

.button-add-quarto {
  padding: 8px 14px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-add-quarto:hover {
  background-color: #218838;
}


</style>