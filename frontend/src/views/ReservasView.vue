<template>
  <div class="reservas-page-container">
    <div class="header-reserva">
      <h2>Gerenciamento de Reservas</h2>
      <button @click="openCreateModal" class="button-add-reserva">
        Adicionar Nova Reserva
      </button>
    </div>

    <p v-if="loading">Carregando reservas...</p>
    <p v-if="error" class="error-message">Erro: {{ error }}</p>

    <div v-if="reservas && reservas.length" class="reservas-grid">
      <ReservaCard
        v-for="reserva in reservas"
        :key="reserva.id_reserva"
        :reserva="reserva"
        @open-popup="handleOpenEditModal"
      />
    </div>
    <p
      v-else-if="!loading && !error && (!reservas || reservas.length === 0)"
      class="no-reservations-message"
    >
      Nenhuma reserva encontrada.
    </p>

    <ReservaModal
      :is-visible="isModalOpen"
      :reserva-to-edit="selectedReserva"
      @close="closeModal"
      @createReserva="handleCreateReserva"
      @updateReserva="handleUpdateReserva"
      @deleteReserva="handleDeleteReserva"
    />
  </div>
</template>

<script>
import ReservaCard from '@/components/ReservaCard.vue';
import ReservaModal from '@/components/modals/ModalReserva.vue';
import axios from 'axios';

const apiReservas = axios.create({
  baseURL: 'http://localhost:3003',
});

export default {
  name: 'ReservasPage',
  components: {
    ReservaCard,
    ReservaModal,
  },
  data() {
    return {
      reservas: [],
      loading: true,
      error: null,
      isModalOpen: false,
      selectedReserva: null,
    };
  },
  async created() {
    await this.fetchReservas();
  },
  methods: {
    async fetchReservas() {
      try {
        this.loading = true;
        this.error = null;
        const timestamp = new Date().getTime();
        const response = await apiReservas.get(`/listar?_=${timestamp}`);
        this.reservas = Array.isArray(response.data) ? response.data : [];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response) {
            this.error = `Erro do servidor (${err.response.status}): ${err.response.data?.message || err.response.data?.error || 'Erro desconhecido do servidor.'}`;
            console.error("Detalhes do erro do servidor:", err.response.data);
          } else if (err.request) {
            this.error = 'Erro de rede: O servidor de reservas não está respondendo. Verifique se o backend está rodando na porta 3003.';
          } else {
            this.error = 'Erro ao configurar a requisição: ' + err.message;
          }
        } else {
          this.error = 'Ocorreu um erro inesperado ao buscar reservas.';
        }
        console.error("Erro ao buscar reservas:", err);
      } finally {
        this.loading = false;
      }
    },
    openCreateModal() {
      this.selectedReserva = null;
      this.isModalOpen = true;
    },
    handleOpenEditModal(reservaId) {
      this.selectedReserva = this.reservas.find((r) => r.id_reserva === reservaId);
      this.isModalOpen = !!this.selectedReserva;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedReserva = null;
      this.fetchReservas(); 
    },
    async handleCreateReserva(newReservaData) {
      try {
        await apiReservas.post('/cadastrar', newReservaData);
        alert('Reserva criada com sucesso!');
        this.closeModal();
      } catch (err) {
        let errorMessage = 'Erro ao criar reserva.';
        if (axios.isAxiosError(err) && err.response) {
            errorMessage += ` Detalhes: ${err.response.data?.message || err.response.data?.error || 'Erro desconhecido do servidor.'}`;
            console.error('Erro ao criar reserva:', err.response.data);
        } else {
            errorMessage += ` Detalhes: ${err.message}`;
            console.error('Erro ao criar reserva:', err.message);
        }
        alert(errorMessage + ' Verifique o console para mais informações.');
      }
    },
    async handleUpdateReserva(updatedReservaData) {
      try {
        console.log(`Attempting to update reservation #${updatedReservaData.id_reserva} with data:`, updatedReservaData);
        await apiReservas.put(`/atualizar/${updatedReservaData.id_reserva}`, updatedReservaData);
        alert('Reserva atualizada com sucesso!');
        this.closeModal();
      } catch (err) {
        let errorMessage = 'Erro ao atualizar reserva.';
        if (axios.isAxiosError(err) && err.response) {
            errorMessage += ` Detalhes: ${err.response.data?.message || err.response.data?.error || 'Erro desconhecido do servidor.'}`;
            console.error('Erro ao atualizar reserva:', err.response.data);
        } else {
            errorMessage += ` Detalhes: ${err.message}`;
            console.error('Erro ao atualizar reserva:', err.message);
        }
        alert(errorMessage + ' Verifique o console para mais informações.');
      }
    },
    async handleDeleteReserva(reservaId) {
      if (!confirm('Tem certeza que deseja deletar esta reserva?')) {
        return;
      }
      try {
        await apiReservas.delete(`/deletar/${reservaId}`);
        alert('Reserva deletada com sucesso!');
        this.closeModal();
      } catch (err) {
        let errorMessage = 'Erro ao deletar reserva.';
        if (axios.isAxiosError(err) && err.response) {
            errorMessage += ` Detalhes: ${err.response.data?.message || err.response.data?.error || 'Erro desconhecido do servidor.'}`;
            console.error('Erro ao deletar reserva:', err.response.data);
        } else {
            errorMessage += ` Detalhes: ${err.message}`;
            console.error('Erro ao deletar reserva:', err.message);
        }
        alert(errorMessage + ' Verifique o console para mais informações.');
      }
    },
  },
};
</script>

<style scoped>
.reservas-page-container {
  padding: 20px;
  max-width: 1900px;
  margin: 0 auto;
}

.header-reserva {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 25px;
}

h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.button-add-reserva {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button-add-reserva:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.reservas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  justify-content: center;
  align-items: start;
}

.loading, .error-message, .no-reservations-message {
  text-align: center;
  margin-top: 20px;
  font-size: 1.1rem;
}

.error-message {
  color: #d9534f; 
  font-weight: bold;
}

.no-reservations-message {
  color: #6c757d;
}
</style>