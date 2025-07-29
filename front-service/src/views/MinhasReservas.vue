<template>
  <div>
    <h2>Minhas Reservas</h2>

    <div v-if="loading">Carregando reservas...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="reservas-container" v-if="reservas.length > 0">
      <ReservaCard
        v-for="reserva in reservas"
        :key="reserva.id_reserva"
        :reserva="reserva"
        @open-popup="abrirDetalhesReserva"
      />
    </div>

    <div v-else-if="!loading && !error">Nenhuma reserva encontrada.</div>
  </div>
</template>

<script>
import ReservaCard from '../components/ReservaCard.vue'; 
import { ref, onMounted } from 'vue';
import { reservationApi } from '../utils/axios'; 

export default {
  components: {
    ReservaCard,
  },

  setup() {
    const reservas = ref([]);
    const loading = ref(false);
    const error = ref(null);

    async function carregarReservas() {
      loading.value = true;
      error.value = null;

      try {
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) {
          error.value = 'Usuário não autenticado.';
          return;
        }

        const response = await reservationApi.get(`/reservasusuario/${usuarioId}`);
        reservas.value = response.data;
      } catch (err) {
        error.value = err.response?.data?.msg || 'Erro ao carregar reservas';
      } finally {
        loading.value = false;
      }
    }

    function abrirDetalhesReserva(idReserva) {
      console.log('Abrir detalhes da reserva com id:', idReserva);
    }

    onMounted(() => {
      carregarReservas();
    });

    return {
      reservas,
      loading,
      error,
      abrirDetalhesReserva,
    };
  },
};
</script>

<style scoped>.quartos-page {
  padding: 20px;
  max-width: 1900px;
  margin: 0 auto;
  box-sizing: border-box;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
}

/* NOVO: Grid das reservas */
.reservas-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  justify-content: center;
  align-items: start;
}

/* Botão verde reaproveitável */
.button-add-item,
.button-add-quarto {
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

.button-add-item:hover,
.button-add-quarto:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

/* Mensagens */
.error {
  color: #d9534f;
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.1rem;
}

.no-reservas-message {
  text-align: center;
  margin-top: 20px;
  color: #6c757d;
  font-size: 1.1rem;
}

/* Paginação */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 10px;
}

.pagination-controls button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.pagination-controls button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.pagination-controls button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.pagination-controls span {
  font-weight: 600;
  font-size: 1.1rem;
}

</style>