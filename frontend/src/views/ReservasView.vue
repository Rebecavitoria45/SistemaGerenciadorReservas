<template>
  <div class="reservas-page">
    <h2>Gerenciamento de Reservas</h2>

    <p v-if="loading">Carregando reservas...</p>
    <p v-if="error" class="error-message">Erro: {{ error }}</p>

    <div v-if="reservas && reservas.length" class="reservas-grid">
      <ReservaCard
        v-for="reserva in reservas"
        :key="reserva.id_reserva"
        :reserva="reserva"
        @open-popup="handleOpenPopup"
      />
    </div>
    <p v-else-if="!loading && !error && (!reservas || reservas.length === 0)" class="no-reservations-message">Nenhuma reserva encontrada.</p>
  </div>
</template>

<script>
import ReservaCard from '../components/ReservaCard.vue';
import axios from 'axios';

export default {
  name: 'ReservasPage',
  components: {
    ReservaCard, 
  },
  data() {
    return {
      reservas: [], 
      loading: true,
      error: null,
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

        console.log("Tentando buscar reservas...");
        const response = await axios.get('http://localhost:3003/listar'); 
        
        console.log("Dados recebidos da API de reservas:", response.data); 
        
        if (Array.isArray(response.data)) {
            this.reservas = response.data;
        } else {
            console.error("Formato inesperado da API de reservas. Esperado um array, recebido:", response.data);
            this.error = "Erro no formato dos dados da API de reservas.";
        }

      } catch (err) {
        console.error('Erro ao buscar reservas:', err);
        if (err.response) {
          this.error = `Erro do servidor: ${err.response.status} - ${err.response.data?.message || 'Erro desconhecido do servidor.'}`;
          console.error("Detalhes da resposta de erro:", err.response.data);
        } else if (err.request) {
          this.error = 'Erro de rede: O servidor de reservas não está respondendo. Verifique se ele está online e a URL do backend está correta.';
          console.error("Nenhuma resposta recebida do servidor:", err.request);
        } else {
          this.error = 'Ocorreu um erro inesperado ao configurar a requisição.';
          console.error("Erro na requisição Axios:", err.message);
        }
      } finally {
        this.loading = false;
      }
    },
    handleOpenPopup(reservaId) {
      console.log(`Você clicou para abrir o popup da reserva com ID: ${reservaId}`);
    },
  },
};
</script>

<style scoped>
.reservas-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.reservas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
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

.no-reservations-message {
  text-align: center;
  margin-top: 20px;
  color: #666;
}
</style>